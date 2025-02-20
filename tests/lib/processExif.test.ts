import path from 'path';
import fs from 'fs';
import { processExif } from '@/lib/processExif';
import { ExifData } from '@/lib/types';

const samplesDir = path.join(process.cwd(), 'public/samples');

describe('processExif', () => {
  let validImagePath: string;
  let invalidFilePath: string;

  beforeAll(() => {
    // `/public/samples/jpg/cats` 디렉토리에서 JPG 파일 찾기
    const jpgDir = path.join(samplesDir, 'jpg/cats');
    const items = fs.readdirSync(jpgDir);
    const jpgFiles = items.filter((file) => /\.(jpe?g|JPE?G)$/i.test(file));

    if (jpgFiles.length > 0) {
      validImagePath = path.join(jpgDir, jpgFiles[0]);
    } else {
      throw new Error('No valid JPG files found for testing.');
    }

    // EXIF 데이터가 없는 샘플 파일
    invalidFilePath = path.join(samplesDir, 'file.svg');
  });

  it('should return parsed EXIF data for a valid JPEG file', async () => {
    const exifData = await processExif(validImagePath);

    // 기본 필드 검증
    expect(exifData).toHaveProperty('make');
    expect(exifData).toHaveProperty('model');
    expect(exifData).toHaveProperty('iso');
    expect(exifData).toHaveProperty('exposureTime');
    expect(exifData).toHaveProperty('fNumber');
    expect(exifData).toHaveProperty('focalLength');
    expect(exifData).toHaveProperty('dateTimeOriginal');
    expect(exifData).toHaveProperty('gps');

    // 이미지 크기 및 해상도 관련 필드
    expect(exifData).toHaveProperty('exifImageWidth');
    expect(exifData).toHaveProperty('exifImageHeight');
    expect(exifData).toHaveProperty('orientation');
    expect(exifData).toHaveProperty('xResolution');
    expect(exifData).toHaveProperty('yResolution');
    expect(exifData).toHaveProperty('resolutionUnit');

    // 초점면 해상도 정보
    expect(exifData).toHaveProperty('focalPlaneXResolution');
    expect(exifData).toHaveProperty('focalPlaneYResolution');
    expect(exifData).toHaveProperty('focalPlaneResolutionUnit');

    // 색상 보정을 위한 필드
    expect(exifData).toHaveProperty('whitePoint');
    expect(Array.isArray((exifData as ExifData).whitePoint)).toBe(true);
    expect((exifData as ExifData).whitePoint.length).toBe(2);

    expect(exifData).toHaveProperty('primaryChromaticities');
    expect(Array.isArray((exifData as ExifData).primaryChromaticities)).toBe(
      true,
    );
    expect((exifData as ExifData).primaryChromaticities.length).toBe(6);

    expect(exifData).toHaveProperty('gamma');
    expect(typeof (exifData as ExifData).gamma).toBe('number');

    expect(exifData).toHaveProperty('colorSpace');

    // 추가 초점/거리 및 렌즈 정보
    expect(exifData).toHaveProperty('subjectDistance');
    expect(exifData).toHaveProperty('focusDistance');
    expect(exifData).toHaveProperty('lensModel');
  });

  it('should return a message for a file with no EXIF data', async () => {
    const exifData = await processExif(invalidFilePath);

    expect(exifData).toBeDefined();
    expect(exifData).toHaveProperty('message');
    // 필요시: expect(exifData.message).toBe('No EXIF data found');
  });
});
