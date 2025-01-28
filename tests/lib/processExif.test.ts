import path from 'path';
import fs from 'fs';
import { processExif } from '@/lib/processExif';

const samplesDir = path.join(process.cwd(), 'public/samples');

describe('processExif', () => {
  let validImagePath: string;
  let invalidFilePath: string;

  beforeAll(() => {
    // `/public/samples` 디렉토리에서 JPG 파일 찾기
    const items = fs.readdirSync(path.join(samplesDir, 'jpg/cats'));
    const jpgFiles = items.filter((file) => /\.(jpe?g|JPE?G)$/i.test(file));

    if (jpgFiles.length > 0) {
      validImagePath = path.join(samplesDir, 'jpg/cats', jpgFiles[0]);
    } else {
      throw new Error('No valid JPG files found for testing.');
    }

    // EXIF가 없는 샘플 파일 설정
    invalidFilePath = path.join(samplesDir, 'file.svg');
  });

  it('should return parsed EXIF data for a valid JPEG file', async () => {
    const exifData = await processExif(validImagePath);

    expect(exifData).toHaveProperty('make');
    expect(exifData).toHaveProperty('model');
    expect(exifData).toHaveProperty('iso');
    expect(exifData).toHaveProperty('exposureTime');
    expect(exifData).toHaveProperty('fNumber');
    expect(exifData).toHaveProperty('focalLength');
    expect(exifData).toHaveProperty('dateTimeOriginal');
    expect(exifData).toHaveProperty('gps');
  });

  it('should return a message for a file with no EXIF data', async () => {
    const exifData = await processExif(invalidFilePath);

    expect(exifData).toBeDefined();
    expect(exifData).toHaveProperty('message');
    // expect(exifData?.message).toBe('No EXIF data found');
  });
});
