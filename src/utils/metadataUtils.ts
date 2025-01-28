import sharp from 'sharp';
import fs from 'fs';
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
    const stats = fs.statSync(filePath);

    // exifr를 활용하여 EXIF 데이터 추출
    const exifData = await processExif(filePath);

    // 메타데이터 객체 반환
    return {
      fileName: path.basename(filePath),
      category: category || path.basename(path.dirname(filePath)), // 카테고리 기본값 설정
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: stats.size,
      exif: exifData, // 사람이 읽을 수 있는 EXIF 데이터
    };
  } catch (error: any) {
    console.error(
      `Failed to extract metadata for file: ${filePath}`,
      error.message,
    );
    throw new Error(`Failed to extract metadata for file: ${filePath}`);
  }
};
