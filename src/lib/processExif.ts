import exifr from 'exifr';
import fs from 'fs';
import { ExifData } from '@/lib/types';

export const processExif = async (
  filePath: string,
): Promise<
  | ExifData
  | {
      message: string;
    }
> => {
  try {
    // 파일 내용을 Buffer로 읽기
    const fileBuffer = fs.readFileSync(filePath);

    // exifr로 EXIF 데이터 추출
    const exifData = await exifr.parse(fileBuffer, {
      tiff: true,
      exif: true,
      gps: true,
    });

    // EXIF 데이터가 없는 경우 처리
    if (!exifData || Object.keys(exifData).length === 0) {
      console.warn(`No EXIF data found for file: ${filePath}`);
      return { message: 'No EXIF data found' };
    }

    return {
      make: exifData.Make || 'Unknown',
      model: exifData.Model || 'Unknown',
      iso: exifData.ISO || 0,
      exposureTime: exifData.ExposureTime || 'Unknown',
      fNumber: exifData.FNumber || 'Unknown',
      focalLength: exifData.FocalLength || 'Unknown',
      dateTimeOriginal: exifData.DateTimeOriginal || 'Unknown',
      gps:
        exifData.GPSLatitude && exifData.GPSLongitude
          ? { latitude: exifData.GPSLatitude, longitude: exifData.GPSLongitude }
          : 'No GPS data',
    };
  } catch (error: any) {
    // 에러 처리
    if (error.message.includes('unsupported')) {
      console.warn(`Unsupported file format for EXIF extraction: ${filePath}`);
      return { message: 'Unsupported file format' };
    }

    console.error(`Failed to process EXIF data for file: ${filePath}`, error);
    return { message: `Failed to process EXIF data` };
  }
};
