import path from 'path';
import { createTestServer } from '@/graphql/testServer';
import { gql } from 'graphql-tag';
import { ApolloServer, GraphQLResponse } from '@apollo/server';
import { getAllImages } from '@/utils/fileUtils';

describe('GraphQL Query Tests', () => {
  let server: ApolloServer;

  beforeAll(() => {
    server = createTestServer();
  });

  it('should fetch metadata with id and match the file count', async () => {
    const samplesDir = path.join(process.cwd(), 'public/samples'); // 샘플 이미지 경로
    const expectedImages = getAllImages(samplesDir); // 이미지 파일 가져오기

    const GET_METADATA = gql`
      query GetMetadata {
        metadata {
          id # id 필드를 추가
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

      const metadata = singleResult?.data?.metadata;

      expect(metadata).toBeInstanceOf(Array); // 데이터는 배열이어야 함
      expect(metadata).toHaveLength(expectedImages.length); // 파일 개수와 일치해야 함

      // 각 항목에 대한 필드 검증
      metadata.forEach((item: any, index: number) => {
        expect(item).toHaveProperty('id'); // id 필드 확인
        expect(item.id).toMatch(
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
        ); // UUID 형식 확인

        // 파일 이름과 카테고리 검증
        const expectedFileName = path.basename(expectedImages[index]);
        const expectedCategory = path.basename(
          path.dirname(expectedImages[index]),
        );
        expect(item.fileName).toBe(expectedFileName);
        expect(item.category).toBe(expectedCategory);
      });
    } else {
      // 예상치 못한 응답 형식 처리 (예: 점진적 결과)
      throw new Error('Unexpected incremental response');
    }
  });
});
