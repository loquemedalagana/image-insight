import exifr from 'exifr';
import { ProcessExifReturn } from '@/lib/types';

export const processExif = async (
  filePath: string,
): Promise<ProcessExifReturn> => {
  try {
    const exifData = await exifr.parse(filePath, {
      tiff: true,
      exif: true,
      gps: true,
    });

    if (!exifData) {
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
    return null; // 오류 발생 시 null 반환
  }
};
