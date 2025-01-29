import sharp from 'sharp';
import fs from 'fs/promises'; // 비동기 파일 작업을 위한 fs/promises 사용
import path from 'path';
import { processExif } from '@/lib/processExif';
import { v4 as uuidv4 } from 'uuid';
import { BASE_URL } from '@/config';

// 개별 파일에서 메타데이터를 추출하는 함수
export const extractPhotoMetadata = async (
  filePath: string,
  category?: string,
) => {
  try {
    // 파일 존재 여부 확인
    await fs.access(filePath);

    // Sharp로 기본 메타데이터 추출
    const metadata = await sharp(filePath).metadata();

    // 비동기 방식으로 파일 정보 가져오기
    const stats = await fs.stat(filePath);

    // exifr를 활용하여 EXIF 데이터 추출
    const exifData = (await processExif(filePath)) || {};

    // 카테고리 자동 추출 (파일 경로 기준)
    const resolvedCategory = category ?? path.basename(path.dirname(filePath));

    // 이미지 URL 생성 (public/samples/{category}/{fileName})
    const relativePath = path.relative('public', filePath); // public 디렉토리 내부 경로
    const imageUrl = `${BASE_URL}/${relativePath.replace(/\\/g, '/')}`; // URL 변환

    // 메타데이터 객체 반환
    return {
      id: uuidv4(), // 고유 ID 생성
      fileName: path.basename(filePath),
      category: resolvedCategory,
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: stats.size,
      exif: exifData, // 사람이 읽을 수 있는 EXIF 데이터
      imageUrl, // 이미지 접근을 위한 URL 추가
    };
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error(`File not found: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    } else if (error.message.includes('unsupported image format')) {
      console.error(`Sharp Error: Unsupported image format: ${filePath}`);
    } else if (error.message.includes('processExif')) {
      console.error(
        `EXIF processing failed for file: ${filePath}, Error: ${error.message}`,
      );
    } else {
      console.error(
        `Unexpected error for file: ${filePath}, Error: ${error.message}`,
      );
    }
    throw new Error(`Failed to extract metadata for file: ${filePath}`);
  }
};
