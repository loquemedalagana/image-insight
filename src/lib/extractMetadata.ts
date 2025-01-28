import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const samplesDir = path.join(process.cwd(), 'public/samples');

function* walkDir(dir: string): Generator<string> {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      // 디렉토리라면 재귀적으로 탐색
      yield* walkDir(itemPath);
    } else if (stats.isFile() && /\.(jpe?g|JPE?G)$/i.test(item)) {
      // 이미지 파일만 반환
      yield itemPath;
    }
  }
}

export const extractMetadata = async () => {
  const photos = [];

  for (const filePath of walkDir(samplesDir)) {
    try {
      const metadata = await sharp(filePath).metadata();
      const stats = fs.statSync(filePath);

      photos.push({
        fileName: path.basename(filePath),
        category: path.basename(path.dirname(filePath)), // 디렉토리 이름을 카테고리로 사용
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: stats.size,
        exif: metadata.exif ? metadata.exif.toString() : 'No EXIF data',
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
