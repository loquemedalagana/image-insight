import exifr from 'exifr';
import fs from 'fs';

export const processExif = async (filePath: string) => {
  try {
    // 파일 내용을 Buffer로 읽기
    const fileBuffer = fs.readFileSync(filePath);

    // exifr로 EXIF 데이터 추출
    const exifData = await exifr.parse(fileBuffer, {
      tiff: true,
      exif: true,
      gps: true,
    });

    if (!exifData) {
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
    console.error(
      `Failed to process EXIF data for file: ${filePath}`,
      error.message,
    );
    return null; // 실패 시 null 반환
  }
};
