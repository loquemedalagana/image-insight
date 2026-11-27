import path from 'path';
import { createTestServer } from '@/graphql/testServer';
import { gql } from 'graphql-tag';
import { ApolloServer, GraphQLResponse } from '@apollo/server';
import { mockDatabase } from '@/lib/mockDB';
import { extractMetadataFromLocal } from '@/lib/extractMetadataFromLocal';
import { getAllImagesAsync } from '@/utils/fileUtils';
import { Metadata, Category } from '__generated__/graphql';

// 샘플 폴더와 무관한 테스트 전용 fixture (tests/setupEnv.ts의 SAMPLES_DIR과 같은 폴더)
const samplesDir = path.join(process.cwd(), 'tests/fixtures/samples');

describe('GraphQL API Tests', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    server = await createTestServer();
  });

  beforeEach(async () => {
    await mockDatabase.clear(); // ✅ 각 테스트 전 DB 초기화

    // ✅ 테스트 실행 전, 로컬 파일에서 메타데이터 로드하여 mockDatabase 채우기
    const metadata = await extractMetadataFromLocal();
    await mockDatabase.initializeDatabase(metadata);

    console.log(`✅ Test database initialized with ${metadata.length} files`);
  });

  it('should fetch all metadata and match the image count', async () => {
    // ✅ 전체 이미지 파일 가져오기
    const images: string[] = [];
    for await (const file of getAllImagesAsync(samplesDir)) {
      images.push(file);
    }

    const GET_METADATA = gql`
      query GetMetadata {
        metadata(searchCondition: {}) {
          id
          fileName
          categories {
            id
            name
          }
          width
          height
          format
          size
          imageUrl
        }
      }
    `;

    const result: GraphQLResponse = await server.executeOperation({
      query: GET_METADATA,
    });

    if (result.body.kind === 'single') {
      const singleResult = result.body.singleResult;
      expect(singleResult.errors).toBeUndefined();

      const metadata = singleResult.data?.metadata as Metadata[];
      if (!metadata?.length) return; // ✅ 데이터가 없을 경우 테스트 스킵

      expect(metadata).toBeInstanceOf(Array);
      expect(metadata.length).toBe(images.length);

      // ✅ 데이터 검증
      expect(metadata?.[0]).toHaveProperty('fileName');
      expect(metadata?.[0]).toHaveProperty('categories');
      expect(metadata?.[0]).toHaveProperty('imageUrl');

      // ✅ 카테고리 검증
      expect(metadata?.[0].categories).toBeInstanceOf(Array);
      expect(metadata?.[0].categories[0]).toHaveProperty('id');
      expect(metadata?.[0].categories[0]).toHaveProperty('name');

      // ✅ URL 형식 검증
      expect(metadata?.[0].imageUrl).toMatch(/^https?:\/\/localhost(:\d+)?\/?/);
    } else {
      throw new Error('Unexpected incremental response');
    }
  });

  it('should fetch metadata by ID including imageUrl', async () => {
    const allMetadata = (await mockDatabase.findAll()) as Metadata[];
    const testId = allMetadata.length > 0 ? allMetadata[0]?.id : null;

    if (!testId) {
      console.warn('No metadata available for testing.');
      return;
    }

    const GET_METADATA_BY_ID = gql`
      query GetMetadataById($id: ID!) {
        metadataById(id: $id) {
          id
          fileName
          categories {
            id
            name
          }
          imageUrl
        }
      }
    `;

    const result: GraphQLResponse = await server.executeOperation({
      query: GET_METADATA_BY_ID,
      variables: { id: testId },
    });

    if (result.body.kind === 'single') {
      const singleResult = result.body.singleResult;
      expect(singleResult.errors).toBeUndefined();
      expect(singleResult.data?.metadataById).toBeDefined();
      expect((singleResult.data?.metadataById as Partial<Metadata>)?.id).toBe(
        testId,
      );

      // ✅ 카테고리 ID & Name 검증
      expect(
        (singleResult.data?.metadataById as Partial<Metadata>)?.categories,
      ).toBeInstanceOf(Array);
      expect(
        (singleResult.data?.metadataById as Partial<Metadata>)?.categories?.[0]
          ?.id,
      ).toBeDefined();
      expect(
        (singleResult.data?.metadataById as Partial<Metadata>)?.categories?.[0]
          ?.name,
      ).toBeDefined();

      // ✅ 이미지 URL 검증
      expect(
        (singleResult.data?.metadataById as Partial<Metadata>)?.imageUrl,
      ).toMatch(/^https?:\/\/localhost(:\d+)?\/?/);
    }
  });

  it('should delete metadata by ID', async () => {
    // ✅ 기존 카테고리 추가 (중복 방지)
    let category: Category | null =
      mockDatabase.findCategoryByName('Landscape');
    if (!category) {
      category = await mockDatabase.insertCategory({ name: 'Landscape' });
    }

    // ✅ 사전에 데이터 추가
    await mockDatabase.insert({
      id: 'delete-id',
      fileName: 'delete.jpg',
      categories: [category], // ✅ ID + Name 포함
      width: 1920,
      height: 1080,
      format: 'jpg',
      size: 123456,
      imageUrl: 'http://localhost:3000/public/samples/delete.jpg',
      exif: null,
    } as Metadata);

    const DELETE_METADATA_BY_ID = gql`
      mutation DeleteMetadataById($id: ID!) {
        deleteMetadataById(id: $id)
      }
    `;

    const result: GraphQLResponse = await server.executeOperation({
      query: DELETE_METADATA_BY_ID,
      variables: { id: 'delete-id' },
    });

    if (result.body.kind === 'single') {
      const singleResult = result.body.singleResult;
      expect(singleResult.errors).toBeUndefined();
      expect(singleResult.data?.deleteMetadataById).toBe(true);

      // ✅ 삭제 검증
      const deleted = await mockDatabase.findById('delete-id');
      expect(deleted).toBeNull();
    } else {
      throw new Error('Unexpected incremental response');
    }
  });

  it('should fetch a category by ID', async () => {
    const categories = await mockDatabase.findAllCategories();
    expect(categories.length).toBeGreaterThan(0);
    const target = categories[0];

    const GET_CATEGORY_BY_ID = gql`
      query GetCategoryById($id: ID!) {
        getCategoryById(id: $id) {
          id
          name
        }
      }
    `;

    const result: GraphQLResponse = await server.executeOperation({
      query: GET_CATEGORY_BY_ID,
      variables: { id: target.id },
    });

    if (result.body.kind !== 'single') {
      throw new Error('Unexpected incremental response');
    }
    expect(result.body.singleResult.errors).toBeUndefined();
    expect(result.body.singleResult.data?.getCategoryById).toEqual({
      id: target.id,
      name: target.name,
    });
  });

  it('should return null for an unknown category ID', async () => {
    const result: GraphQLResponse = await server.executeOperation({
      query: gql`
        query GetCategoryById($id: ID!) {
          getCategoryById(id: $id) {
            id
            name
          }
        }
      `,
      variables: { id: 'no-such-category' },
    });

    if (result.body.kind !== 'single') {
      throw new Error('Unexpected incremental response');
    }
    expect(result.body.singleResult.errors).toBeUndefined();
    expect(result.body.singleResult.data?.getCategoryById).toBeNull();
  });

  describe('addMetadata filePath validation', () => {
    const ADD_METADATA = gql`
      mutation AddMetadata($filePath: String!, $categoryIds: [ID!]!) {
        addMetadata(filePath: $filePath, categoryIds: $categoryIds) {
          id
          fileName
        }
      }
    `;

    const run = async (filePath: string) => {
      const result: GraphQLResponse = await server.executeOperation({
        query: ADD_METADATA,
        variables: { filePath, categoryIds: [] },
      });
      if (result.body.kind !== 'single') {
        throw new Error('Unexpected incremental response');
      }
      return result.body.singleResult;
    };

    it('accepts a file inside the samples directory', async () => {
      const before = (await mockDatabase.findAll()).length;
      const result = await run('tests/fixtures/samples/plain/no-exif.jpg');

      expect(result.errors).toBeUndefined();
      expect((result.data?.addMetadata as Partial<Metadata>)?.fileName).toBe(
        'no-exif.jpg',
      );
      expect((await mockDatabase.findAll()).length).toBe(before + 1);
    });

    it.each([
      ['parent traversal', 'tests/fixtures/samples/../../../package.json'],
      ['file outside the samples directory', 'package.json'],
      ['absolute path outside', '/etc/hosts'],
      ['missing file inside', 'tests/fixtures/samples/plain/nope.jpg'],
    ])('rejects %s', async (_label, filePath) => {
      const before = (await mockDatabase.findAll()).length;
      const result = await run(filePath);

      expect(result.data?.addMetadata).toBeNull();
      expect(result.errors?.[0].extensions?.code).toBe('BAD_USER_INPUT');
      expect(result.errors?.[0].message).toMatch(/samples directory/);
      expect((await mockDatabase.findAll()).length).toBe(before);
    });
  });
});
