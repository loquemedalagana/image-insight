import exifr from 'exifr';
import fs from 'fs/promises';
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
    // 파일 내용을 Buffer로 비동기적으로 읽기
    const fileBuffer = await fs.readFile(filePath);

    // exifr로 EXIF 데이터 추출
    const exifData = await exifr.parse(fileBuffer, {
      tiff: true, // TIFF 블록 데이터 가져오기
      exif: true, // EXIF 메타데이터
      gps: true, // GPS 위치 정보
      interop: true, // 호환성 관련 정보
      makerNote: true, // 제조사 메타데이터 (카메라 브랜드별 추가 정보)
      userComment: true, // 사용자 메모 포함
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
      subjectDistance: exifData.SubjectDistance || 'Unknown',
      focusDistance: exifData.FocusDistance || 'Unknown',
      colorSpace: exifData.ColorSpace || 'Unknown',
      exposureMode: exifData.ExposureMode || 'Unknown',
      lensModel: exifData.LensModel || 'Unknown',
      lensInfo: exifData.LensInfo || 'Unknown',

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
