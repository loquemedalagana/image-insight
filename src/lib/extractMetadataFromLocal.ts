import fs from 'fs/promises';
import path from 'path';
import { extractPhotoMetadata } from '@/utils/metadataUtils'; // Mock DB를 사용

const samplesDir = path.join(process.cwd(), 'public/samples');

// Generator를 사용하여 디렉토리를 탐색
async function* walkDirAsync(
  dir: string,
): AsyncGenerator<{ filePath: string; category: string }> {
  const items = await fs.readdir(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = await fs.stat(itemPath);

    if (stats.isDirectory()) {
      yield* walkDirAsync(itemPath); // 재귀적으로 하위 폴더 탐색
    } else if (stats.isFile() && /\.(jpe?g|JPE?G|cr3|CR3)$/i.test(item)) {
      const category = path.basename(path.dirname(itemPath)); // 폴더명을 카테고리로 설정
      yield { filePath: itemPath, category };
    }
  }
}

// 디렉토리에서 모든 파일 메타데이터를 추출
export const extractMetadataFromLocal = async () => {
  const photos = [];

  for await (const { filePath, category } of walkDirAsync(samplesDir)) {
    try {
      const photo = await extractPhotoMetadata(filePath);
      photos.push({ ...photo, category });
    } catch (error: any) {
      console.error(`Failed to process file: ${filePath}`, error.message);
    }
  }

  return photos;
};
