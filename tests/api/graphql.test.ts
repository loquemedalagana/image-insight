import { createTestServer } from '@/graphql/testServer';
import { gql } from 'apollo-server-micro';

describe('GraphQL Query Tests', () => {
  let server: any;

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

    const result = await server.executeOperation({
      query: GET_METADATA,
    });

    expect(result.errors).toBeUndefined(); // 에러가 없어야 함
    expect(result.data.metadata).toBeInstanceOf(Array); // 데이터는 배열이어야 함
    expect(result.data.metadata[0]).toHaveProperty('fileName');
  });
});
