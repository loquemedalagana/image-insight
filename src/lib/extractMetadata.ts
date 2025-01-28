import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { processExif } from '@/lib/processExif';
import { ExifData } from '@/lib/types';

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

// EXIF와 일반 메타데이터를 통합하여 추출
export const extractMetadata = async () => {
  const photos = [];

  for (const filePath of walkDir(samplesDir)) {
    try {
      // Sharp로 기본 메타데이터 추출
      const metadata = await sharp(filePath).metadata();
      const stats = fs.statSync(filePath);

      // exifr를 활용하여 EXIF 데이터 추출
      const exifData = await processExif(filePath);

      photos.push({
        fileName: path.basename(filePath),
        category: path.basename(path.dirname(filePath)), // 디렉토리 이름을 카테고리로 사용
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: stats.size,
        exif: exifData, // 사람이 읽을 수 있는 EXIF 데이터
      });
    } catch (error: any) {
      console.error(
        `Failed to extract metadata for file: ${filePath}`,
        error.message,
      );
    }
  }

  return photos;
};
