import path from 'path';
import { extractMetadata } from '@/lib/extractMetadata';
import { getAllImages } from '@/utils/fileUtils';

test('extractMetadata should return metadata for all sample images', async () => {
  // 샘플 이미지 디렉토리 경로
  const samplesDir = path.join(process.cwd(), 'public/samples');

  // 예상 파일 목록 가져오기
  const expectedImages = getAllImages(samplesDir);

  // `extractMetadata` 결과 가져오기
  const metadata = await extractMetadata();

  // 로그로 확인
  console.log(`Expected file count: ${expectedImages.length}`);
  console.log(`Extracted metadata count: ${metadata.length}`);

  // 테스트: 메타데이터 배열 반환
  expect(metadata).toBeInstanceOf(Array);

  // 테스트: 파일 개수와 메타데이터 개수가 동일
  expect(metadata.length).toBe(expectedImages.length);

  // 테스트: 각 메타데이터 필드 확인
  metadata.forEach((data, index) => {
    expect(data).toHaveProperty('fileName');
    expect(data).toHaveProperty('category');
    expect(data).toHaveProperty('width');
    expect(data).toHaveProperty('height');
    expect(data).toHaveProperty('format');
    expect(data).toHaveProperty('size');
    expect(data).toHaveProperty('exif');

    // 파일 이름이 올바른지 확인
    const expectedFileName = path.basename(expectedImages[index]);
    expect(data.fileName).toBe(expectedFileName);

    // 카테고리가 올바른지 확인 (디렉토리 이름 기반)
    const expectedCategory = path.basename(path.dirname(expectedImages[index]));
    expect(data.category).toBe(expectedCategory);
  });
});
