import sharp from 'sharp';
import fs from 'fs/promises'; // 비동기 파일 작업을 위한 fs/promises 사용
import path from 'path';
import { processExif } from '@/lib/processExif';

// 개별 파일에서 메타데이터를 추출하는 함수
export const extractPhotoMetadata = async (
  filePath: string,
  category?: string,
) => {
  try {
    // Sharp로 기본 메타데이터 추출
    const metadata = await sharp(filePath).metadata();

    // 비동기 방식으로 파일 정보 가져오기
    const stats = await fs.stat(filePath);

    // exifr를 활용하여 EXIF 데이터 추출
    const exifData = await processExif(filePath);

    // 메타데이터 객체 반환
    return {
      fileName: path.basename(filePath),
      category: category ?? path.basename(path.dirname(filePath)), // 카테고리 기본값 설정
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: stats.size,
      exif: exifData, // 사람이 읽을 수 있는 EXIF 데이터
    };
  } catch (error: any) {
    // Sharp 에러 처리
    if (error.message.includes('Input file is missing')) {
      console.error(`Sharp Error: Missing input file: ${filePath}`);
    } else if (error.message.includes('unsupported image format')) {
      console.error(`Sharp Error: Unsupported image format: ${filePath}`);
    } else if (error.message.includes('processExif')) {
      // EXIF 처리 에러
      console.error(
        `EXIF processing failed for file: ${filePath}, Error: ${error.message}`,
      );
    } else {
      // 예상치 못한 에러
      console.error(
        `Unexpected error for file: ${filePath}, Error: ${error.message}`,
      );
    }
    throw new Error(`Failed to extract metadata for file: ${filePath}`);
  }
};
