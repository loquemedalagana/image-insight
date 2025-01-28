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

  it('should fetch all metadata', async () => {
    const images = getAllImages('public/samples');

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

    const result = (await server.executeOperation({
      query: GET_METADATA,
    })) as GraphQLResponse;

    expect(result.errors).toBeUndefined();
    expect(result.data?.metadata).toBeInstanceOf(Array);

    const metadata = result.data?.metadata;
    expect(metadata?.length).toBeGreaterThan(0); // 데이터가 있어야 함
    expect(metadata?.[0]).toHaveProperty('fileName'); // fileName 필드 검증
  });

  it('should fetch metadata by ID', async () => {
    const testId = ((await mockDatabase.findAll()) as Metadata[])[0]?.id;

    const GET_METADATA_BY_ID = gql`
      query GetMetadataById($id: ID!) {
        metadataById(id: $id) {
          id
          fileName
          category
        }
      }
    `;

    const result = await server.executeOperation({
      query: GET_METADATA_BY_ID,
      variables: { id: testId },
    });

    if (result.body.kind === 'single') {
      const singleResult = result.body.singleResult;
      expect(singleResult?.errors).toBeUndefined();
      expect(singleResult?.data?.metadataById).toBeDefined();
      expect((singleResult?.data?.metadataById as Partial<Metadata>)?.id).toBe(
        testId,
      );
    }
  });

  it('should delete metadata by ID', async () => {
    const allMetadata = await mockDatabase.findAll();
    const testId = allMetadata[0]?.id;

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

      expect(singleResult?.errors).toBeUndefined(); // 에러가 없어야 함
      expect(singleResult?.data?.deleteById).toBe(true); // 삭제 성공 확인

      // 데이터가 삭제되었는지 확인
      const deleted = await mockDatabase.findById(testId);
      expect(deleted).toBeNull(); // 삭제된 데이터는 null이어야 함
    } else {
      // 예상치 못한 응답 형식 처리
      throw new Error('Unexpected incremental response');
    }
  });
});
