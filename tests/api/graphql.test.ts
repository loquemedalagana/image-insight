import { createTestServer } from '@/graphql/testServer';
import { gql } from 'graphql-tag';
import { ApolloServer, GraphQLResponse } from '@apollo/server';
import { mockDatabase } from '@/lib/mockDB';
import { getAllImages } from '@/utils/fileUtils';
import { Metadata } from '__generated__/graphql';

describe('GraphQL API Tests', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    server = await createTestServer();
  });

  it('should fetch all metadata and match the image count', async () => {
    // 전체 이미지 파일 가져오기
    const images = getAllImages('public/samples'); // 파일 경로를 기반으로 전체 이미지 가져오기

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
        }
      }
    `;

    const result: GraphQLResponse = await server.executeOperation({
      query: GET_METADATA,
    });

    // `body.kind`가 "single"인지 확인 후 처리
    if (result.body.kind === 'single') {
      const singleResult = result.body.singleResult;

      expect(singleResult.errors).toBeUndefined(); // 에러가 없어야 함

      const metadata = singleResult.data?.metadata as Metadata[]; // 타입 단언
      expect(metadata).toBeInstanceOf(Array); // 데이터는 배열이어야 함

      // 이미지 파일 개수와 메타데이터 배열 길이 비교
      expect(metadata?.length).toBe(images.length);

      // 데이터 검증
      expect(metadata?.[0]).toHaveProperty('fileName'); // 첫 번째 항목 검증
    } else {
      // 예상치 못한 응답 형식 처리
      throw new Error('Unexpected incremental response');
    }
  });

  it('should fetch metadata by ID', async () => {
    const allMetadata = (await mockDatabase.findAll()) as Metadata[];
    const testId = allMetadata.length > 0 ? allMetadata[0]?.id : null;

    // 만약 testId가 없으면 테스트 스킵
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
    }
  });

  it('should delete metadata by ID', async () => {
    const allMetadata = (await mockDatabase.findAll()) as Metadata[];
    const testId = allMetadata.length > 0 ? allMetadata[0]?.id : null;

    // 만약 testId가 없으면 테스트 스킵
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

    // 결과 처리: body.kind가 "single"인 경우 처리
    if (result.body.kind === 'single') {
      const singleResult = result.body.singleResult;

      expect(singleResult.errors).toBeUndefined(); // 에러가 없어야 함
      expect(singleResult.data?.deleteById).toBe(true); // 삭제 성공 확인

      // 데이터가 삭제되었는지 확인
      const deleted = await mockDatabase.findById(testId);
      expect(deleted).toBeNull(); // 삭제된 데이터는 null이어야 함
    } else {
      // 예상치 못한 응답 형식 처리
      throw new Error('Unexpected incremental response');
    }
  });
});
