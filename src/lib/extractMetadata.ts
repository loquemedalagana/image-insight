import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const samplesDir = path.join(process.cwd(), 'public/samples');

export const extractMetadata = async () => {
  const photos = [];
  const items = fs.readdirSync(samplesDir);

  for (const item of items) {
    const itemPath = path.join(samplesDir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      // files in the directory
      const files = fs
        .readdirSync(itemPath)
        .filter((file) => /\.(jpe?g|JPE?G)$/i.test(file));

      for (const file of files) {
        const filePath = path.join(itemPath, file);
        try {
          const metadata = await sharp(filePath).metadata();
          photos.push({
            fileName: file,
            category: item, // use directory name as category
            width: metadata.width || 0,
            height: metadata.height || 0,
            format: metadata.format || 'unknown',
            size: stats.size,
            exif: metadata.exif ? metadata.exif.toString() : 'No EXIF data',
          });
        } catch (error: any) {
          console.error(
            `Failed to extract metadata for file: ${file}`,
            error.message,
          );
        }
      }
    } else if (stats.isFile()) {
      // to process files, not directories
      if (/\.(jpe?g|JPE?G)$/i.test(item)) {
        try {
          const metadata = await sharp(itemPath).metadata();
          photos.push({
            fileName: item,
            category: 'root', // use 'root' as category for files in the root
            width: metadata.width || 0,
            height: metadata.height || 0,
            format: metadata.format || 'unknown',
            size: stats.size,
            exif: metadata.exif ? metadata.exif.toString() : 'No EXIF data',
          });
        } catch (error: any) {
          console.error(
            `Failed to extract metadata for file: ${item}`,
            error.message,
          );
        }
      } else {
        console.warn(`Skipping unsupported file: ${item}`);
      }
    } else {
      console.warn(`Skipping non-file, non-directory item: ${item}`);
    }
  }

  return photos;
};
