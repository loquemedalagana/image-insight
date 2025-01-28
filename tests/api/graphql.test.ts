import { createTestServer } from '@/graphql/testServer';
import { gql } from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { mockDatabase } from '@/lib/mockDB';

describe('GraphQL API Tests', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    server = await createTestServer();
  });

  it('should fetch all metadata', async () => {
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

    const result = await server.executeOperation({
      query: GET_METADATA,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.metadata).toBeInstanceOf(Array);

    const metadata = result.data?.metadata;
    expect(metadata?.length).toBeGreaterThan(0); // 데이터가 있어야 함
    expect(metadata?.[0]).toHaveProperty('fileName'); // fileName 필드 검증
  });

  it('should fetch metadata by ID', async () => {
    const testId = mockDatabase.findAll()[0]?.id;

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

    expect(result.errors).toBeUndefined();
    expect(result.data?.metadataById).toBeDefined();
    expect(result.data?.metadataById?.id).toBe(testId);
  });

  it('should delete metadata by ID', async () => {
    const testId = mockDatabase.findAll()[0]?.id;

    const DELETE_METADATA_BY_ID = gql`
      mutation DeleteMetadataById($id: ID!) {
        deleteById(id: $id)
      }
    `;

    const result = await server.executeOperation({
      query: DELETE_METADATA_BY_ID,
      variables: { id: testId },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteById).toBe(true);

    // 데이터가 삭제되었는지 확인
    const deleted = mockDatabase.findById(testId);
    expect(deleted).toBeUndefined();
  });
});
