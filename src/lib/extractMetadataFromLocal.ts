import fs from 'fs/promises';
import path from 'path';
import { extractPhotoMetadata } from '@/utils/metadataUtils';
import { mockDatabase } from '@/lib/mockDB';
import { Metadata, Category } from '__generated__/graphql';

const samplesDir = path.join(process.cwd(), 'public/samples');

// ✅ Generator를 사용하여 디렉토리를 탐색 (카테고리 ID 미리 처리)
async function* walkDirAsync(
  dir: string,
): AsyncGenerator<{ filePath: string; categoryName: string }> {
  const items = await fs.readdir(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = await fs.stat(itemPath);

    if (stats.isDirectory()) {
      yield* walkDirAsync(itemPath); // ✅ 하위 폴더 재귀 탐색
    } else if (stats.isFile() && /\.(jpe?g|JPE?G|cr3|CR3)$/i.test(item)) {
      const categoryName = path.basename(path.dirname(itemPath)); // ✅ 폴더명을 카테고리명으로 사용
      yield { filePath: itemPath, categoryName };
    }
  }
}

// ✅ 디렉토리에서 모든 파일 메타데이터를 추출
export const extractMetadataFromLocal = async (): Promise<Metadata[]> => {
  const photos: Metadata[] = [];

  for await (const { filePath, categoryName } of walkDirAsync(samplesDir)) {
    try {
      // ✅ 기존 카테고리 조회 (없으면 생성)
      let category: Category | null =
        mockDatabase.findCategoryByName(categoryName);

      if (!category) {
        category = await mockDatabase.insertCategory({ name: categoryName });

        // ✅ insertCategory가 실패했을 경우 예외 처리
        if (!category) {
          console.error(`Failed to insert category: ${categoryName}`);
          continue; // 다음 파일 처리로 넘어감
        }
      }

      const photo = await extractPhotoMetadata(filePath);
      photos.push({ ...photo, categories: [category] } as Metadata); // ✅ ID 포함 카테고리 적용
    } catch (error: any) {
      console.error(`Failed to process file: ${filePath}`, error.message);
    }
  }

  return photos;
};
