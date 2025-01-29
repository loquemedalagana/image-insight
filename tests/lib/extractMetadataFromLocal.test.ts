import path from 'path';
import { extractMetadataFromLocal } from '@/lib/extractMetadataFromLocal';
import { getAllImagesAsync } from '@/utils/fileUtils';

test('extractMetadataFromLocal should return metadata for all sample images', async () => {
  // 샘플 이미지 디렉토리 경로
  const samplesDir = path.join(process.cwd(), 'public/samples');

  // ✅ 예상 파일 목록 가져오기 (`Array.fromAsync()` 제거)
  const expectedImages: string[] = [];
  for await (const file of getAllImagesAsync(samplesDir)) {
    expectedImages.push(file);
  }

  // `extractMetadataFromLocal` 결과 가져오기
  const metadata = await extractMetadataFromLocal();

  // ✅ 로그 확인
  console.log(`Expected file count: ${expectedImages.length}`);
  console.log(`Extracted metadata count: ${metadata.length}`);

  // ✅ 데이터 검증
  expect(metadata).toBeInstanceOf(Array);
  expect(metadata.length).toBe(expectedImages.length);

  metadata.forEach((data, index) => {
    expect(data).toHaveProperty('fileName');
    expect(data).toHaveProperty('categories');
    expect(data).toHaveProperty('width');
    expect(data).toHaveProperty('height');
    expect(data).toHaveProperty('format');
    expect(data).toHaveProperty('size');
    expect(data).toHaveProperty('exif');

    // ✅ 파일 이름 검증
    const expectedFileName = path.basename(expectedImages[index]);
    expect(data.fileName).toBe(expectedFileName);

    // ✅ 카테고리 검증 (배열)
    const expectedCategory = path.basename(path.dirname(expectedImages[index]));
    expect(data.categories).toContain(expectedCategory);
  });
});
