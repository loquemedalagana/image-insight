import fs from 'fs';
import path from 'path';
import { extractMetadata } from '@/lib/extractMetadata';

test('extractMetadata should return metadata for all sample images', async () => {
  // 실제 파일 시스템에서 /public/samples 디렉토리 내의 모든 JPG 파일 읽기
  const samplesDir = path.join(process.cwd(), 'public/samples');

  const getAllImages = (dir: string): string[] => {
    const items = fs.readdirSync(dir);
    const images: string[] = [];

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        // 하위 디렉토리의 이미지 파일 재귀적으로 검색
        images.push(...getAllImages(itemPath));
      } else if (stats.isFile() && /\.(jpe?g|JPE?G)$/i.test(item)) {
        images.push(itemPath);
      }
    }

    return images;
  };

  const expectedImages = getAllImages(samplesDir);

  // `extractMetadata` 결과 가져오기
  const metadata = await extractMetadata();

  // 로그로 파일 개수 확인
  console.log(`Expected file count: ${expectedImages.length}`);
  console.log(`Extracted metadata count: ${metadata.length}`);

  // 비교 테스트
  expect(metadata).toBeInstanceOf(Array);
  expect(metadata.length).toBe(expectedImages.length); // 파일 개수와 메타데이터 개수가 동일해야 함
  expect(metadata[0]).toHaveProperty('fileName');
});
