import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const samplesDir = path.join(process.cwd(), 'public/samples');

export const extractMetadata = async () => {
  const photos = [];
  const categories = fs.readdirSync(samplesDir);

  for (const category of categories) {
    const categoryPath = path.join(samplesDir, category);
    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => /\.(jpe?g|JPE?G)$/.test(file));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      try {
        const metadata = await sharp(filePath).metadata();

        photos.push({
          fileName: file,
          category,
          width: metadata.width || 0,
          height: metadata.height || 0,
          format: metadata.format || 'unknown',
          size: fs.statSync(filePath).size,
          exif: metadata.exif ? metadata.exif.toString() : 'No EXIF data', // EXIF 데이터를 문자열로 처리
        });
      } catch (error: any) {
        console.error(`Failed to extract metadata for ${file}:`, error.message);
      }
    }
  }

  return photos;
};
