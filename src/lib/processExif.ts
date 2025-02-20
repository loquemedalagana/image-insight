import exifr from 'exifr';
import fs from 'fs/promises';
import { ExifData } from '@/lib/types';

export const processExif = async (
  filePath: string,
): Promise<ExifData | { message: string }> => {
  try {
    // 파일 내용을 Buffer로 비동기적으로 읽기
    const fileBuffer = await fs.readFile(filePath);

    // exifr로 EXIF 데이터 추출 (TIFF, EXIF, GPS, 인터옵, 메이커노트 포함)
    const exifData = await exifr.parse(fileBuffer, {
      tiff: true,
      exif: true,
      gps: true,
      interop: true,
      makerNote: true,
    });

    // mongoDB에 저장

    // EXIF 데이터가 없는 경우 처리
    if (!exifData || Object.keys(exifData).length === 0) {
      console.warn(`No EXIF data found for file: ${filePath}`);
      return { message: 'No EXIF data found' };
    }

    return {
      // 기본 카메라 정보
      make: exifData.Make || 'Unknown',
      model: exifData.Model || 'Unknown',
      iso: exifData.ISO || 0,
      exposureTime:
        typeof exifData.ExposureTime === 'number' ? exifData.ExposureTime : 0,
      fNumber: typeof exifData.FNumber === 'number' ? exifData.FNumber : 0,
      focalLength:
        typeof exifData.FocalLength === 'number' ? exifData.FocalLength : 0,
      dateTimeOriginal: exifData.DateTimeOriginal
        ? new Date(exifData.DateTimeOriginal).toISOString()
        : 'Unknown',

      // 이미지 및 센서 크기 정보 (내재 행렬 계산 등 캘리브레이션에 필요)
      exifImageWidth: exifData.ExifImageWidth || 0,
      exifImageHeight: exifData.ExifImageHeight || 0,
      orientation: exifData.Orientation || 'Unknown',
      xResolution: exifData.XResolution || 0,
      yResolution: exifData.YResolution || 0,
      resolutionUnit: exifData.ResolutionUnit || 'Unknown',

      // 초점면 해상도 정보 (픽셀 크기 및 센서 물리적 크기 관련)
      focalPlaneXResolution: exifData.FocalPlaneXResolution || 0,
      focalPlaneYResolution: exifData.FocalPlaneYResolution || 0,
      focalPlaneResolutionUnit: exifData.FocalPlaneResolutionUnit || 'Unknown',

      // 색상 및 보정 정보
      whitePoint: exifData.WhitePoint || [0, 0],
      primaryChromaticities: exifData.PrimaryChromaticities || [
        0, 0, 0, 0, 0, 0,
      ],
      gamma: exifData.Gamma || 2.2,
      colorSpace: exifData.ColorSpace || 'Unknown',

      // GPS 정보
      gps:
        exifData.GPSLatitude !== undefined &&
        exifData.GPSLongitude !== undefined
          ? { latitude: exifData.GPSLatitude, longitude: exifData.GPSLongitude }
          : 'No GPS data',

      // 추가 초점/거리 정보 (없을 경우 기본값 0)
      subjectDistance:
        typeof exifData.SubjectDistance === 'number'
          ? exifData.SubjectDistance
          : 0,
      focusDistance:
        typeof exifData.FocusDistance === 'number' ? exifData.FocusDistance : 0,

      // 렌즈 관련 정보
      lensModel: exifData.LensModel || 'Unknown',
    };
  } catch (error: any) {
    // 에러 처리: 지원되지 않는 파일 형식 등
    if (error.message.includes('unsupported')) {
      console.warn(`Unsupported file format for EXIF extraction: ${filePath}`);
      return { message: 'Unsupported file format' };
    }
    console.error(`Failed to process EXIF data for file: ${filePath}`, error);
    return { message: 'Failed to process EXIF data' };
  }
};
