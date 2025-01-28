import { createTestServer } from '@/graphql/testServer';
import { gql } from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { ExecutionResult } from 'graphql';

describe('GraphQL Query Tests', () => {
  let server: ApolloServer;

  beforeAll(() => {
    server = createTestServer();
  });

  it('should fetch metadata', async () => {
    const GET_METADATA = gql`
      query GetMetadata {
        metadata {
          fileName
          category
          width
          height
          format
          size
          exif {
            make
            model
            iso
            exposureTime
            fNumber
            focalLength
            dateTimeOriginal
            gps {
              latitude
              longitude
            }
          }
        }
      }
    `;

    // 명시적으로 ExecutionResult 타입 사용
    const result: ExecutionResult = await server.executeOperation({
      query: GET_METADATA,
    });

    // 데이터와 오류 검사
    expect(result.errors).toBeUndefined(); // 에러가 없어야 함
    expect(result.data).toBeDefined(); // 데이터가 정의되어 있어야 함
    expect(result.data?.metadata).toBeInstanceOf(Array); // 데이터는 배열이어야 함
    expect(result.data?.metadata[0]).toHaveProperty('fileName');
  });
});
