import fs from 'fs';
import path from 'path';
import { extractPhotoMetadata } from '@/utils/metadataUtils'; // Mock DB를 사용

const samplesDir = path.join(process.cwd(), 'public/samples');

// Generator를 사용하여 디렉토리를 탐색
function* walkDir(dir: string): Generator<string> {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      yield* walkDir(itemPath); // 하위 디렉토리 탐색
    } else if (stats.isFile() && /\.(jpe?g|JPE?G|cr3|CR3)$/i.test(item)) {
      yield itemPath; // 이미지 파일만 반환
    }
  }
}

// 디렉토리에서 모든 파일 메타데이터를 추출
export const extractMetadataFromLocal = async () => {
  const photos = [];

  for (const filePath of walkDir(samplesDir)) {
    try {
      const photo = await extractPhotoMetadata(filePath);
      photos.push(photo);
    } catch (error: any) {
      console.error(`Failed to process file: ${filePath}`, error.message);
      // 특정 파일에서 실패해도 전체 처리를 계속 진행
    }
  }

  return photos;
};
