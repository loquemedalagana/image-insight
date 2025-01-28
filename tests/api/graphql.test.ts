import { createTestServer } from '@/graphql/testServer';
import { gql } from 'graphql-tag';
import { ApolloServer, GraphQLResponse } from '@apollo/server';

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

    const result: GraphQLResponse = await server.executeOperation({
      query: GET_METADATA,
    });

    // kind가 "single"인 경우에만 처리
    if (result.body.kind === 'single') {
      const singleResult = result.body.singleResult;

      // 데이터와 오류 검사
      expect(singleResult?.errors).toBeUndefined(); // 에러가 없어야 함
      expect(singleResult?.data).toBeDefined(); // 데이터가 정의되어 있어야 함
      expect(singleResult?.data?.metadata).toBeInstanceOf(Array); // 데이터는 배열이어야 함
      expect((singleResult?.data?.metadata as any[])[0]).toHaveProperty(
        'fileName',
      );
    } else {
      // 예상치 못한 응답 형식 처리 (예: 점진적 결과)
      throw new Error('Unexpected incremental response');
    }
  });
});
