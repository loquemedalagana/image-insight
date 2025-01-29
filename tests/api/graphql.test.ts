import { createTestServer } from '@/graphql/testServer';
import { gql } from 'graphql-tag';
import { ApolloServer, GraphQLResponse } from '@apollo/server';
import { mockDatabase } from '@/lib/mockDB';
import { getAllImagesAsync } from '@/utils/fileUtils';
import { Metadata } from '__generated__/graphql';

describe('GraphQL API Tests', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    server = await createTestServer();
  });

  it('should fetch all metadata and match the image count', async () => {
    // 전체 이미지 파일 가져오기
    const images = await Array.fromAsync(getAllImagesAsync('public/samples')); // 파일 경로를 기반으로 전체 이미지 가져오기

    const GET_METADATA = gql`
      query GetMetadata {
        metadata {
          id
          fileName
          category
          width
          height
          format
          size
          imageUrl # 추가된 필드 테스트
        }
      }
    `;

    const result: GraphQLResponse = await server.executeOperation({
      query: GET_METADATA,
    });

    if (result.body.kind === 'single') {
      const singleResult = result.body.singleResult;

      expect(singleResult.errors).toBeUndefined(); // 에러가 없어야 함

      const metadata = singleResult.data?.metadata as Metadata[]; // 타입 단언
      expect(metadata).toBeInstanceOf(Array); // 데이터는 배열이어야 함
      expect(metadata?.length).toBe(images.length);

      // 데이터 검증
      expect(metadata?.[0]).toHaveProperty('fileName');
      expect(metadata?.[0]).toHaveProperty('imageUrl'); // ✅ imageUrl 필드가 포함되어야 함
      expect(metadata?.[0].imageUrl).toMatch(
        /^(https?:\/\/)(localhost|[\w.-]+)(:\d{1,5})?\/?/,
      ); // ✅ URL 형식 검증
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
          category
          imageUrl # ✅ 추가된 필드
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
      expect(
        (singleResult.data?.metadataById as Partial<Metadata>)?.imageUrl,
      ).toMatch(/^(https?:\/\/)(localhost|[\w.-]+)(:\d{1,5})?\/?/); // ✅ URL 형식 검증
    }
  });

  it('should delete metadata by ID', async () => {
    const allMetadata = (await mockDatabase.findAll()) as Metadata[];
    const testId = allMetadata.length > 0 ? allMetadata[0]?.id : null;

    if (!testId) {
      console.warn('No metadata available for testing.');
      return;
    }

    const DELETE_METADATA_BY_ID = gql`
      mutation DeleteMetadataById($id: ID!) {
        deleteById(id: $id)
      }
    `;

    const result: GraphQLResponse = await server.executeOperation({
      query: DELETE_METADATA_BY_ID,
      variables: { id: testId },
    });

    if (result.body.kind === 'single') {
      const singleResult = result.body.singleResult;

      expect(singleResult.errors).toBeUndefined();
      expect(singleResult.data?.deleteById).toBe(true);

      // 데이터가 삭제되었는지 확인
      const deleted = await mockDatabase.findById(testId);
      expect(deleted).toBeNull();
    } else {
      throw new Error('Unexpected incremental response');
    }
  });
});
