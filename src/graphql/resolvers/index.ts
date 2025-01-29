import { extractMetadataFromLocal } from '@/lib/extractMetadataFromLocal';
import { mockDatabase } from '@/lib/mockDB';
import { extractPhotoMetadata } from '@/utils/metadataUtils';
import { Metadata, MetadataSearchCondition } from '__generated__/graphql';

export const resolvers = {
  Query: {
    metadata: async (
      _: any,
      { searchCondition }: { searchCondition?: MetadataSearchCondition },
    ) => {
      const metadata = (await mockDatabase.findAll()) as Metadata[];

      // ✅ 검색 조건이 없거나 `{}`이면 전체 데이터 반환
      if (!searchCondition || Object.keys(searchCondition).length === 0) {
        return metadata;
      }

      return metadata.filter((item) => {
        const categoryMatch =
          !searchCondition.category ||
          (Array.isArray(item.categories)
            ? item.categories.includes(searchCondition.category)
            : false);

        const fileNameMatch =
          !searchCondition.fileName ||
          item.fileName.includes(searchCondition.fileName);

        return categoryMatch && fileNameMatch;
      });
    },

    // ID로 메타데이터 조회
    metadataById: async (_: any, { id }: { id: string }) => {
      const metadata = await mockDatabase.findById(id); // Mock DB에서 비동기 검색
      console.log('Metadata by ID:', id, metadata); // 디버깅용 로그
      return metadata || null; // 데이터가 없으면 null 반환
    },

    // ✅ 카테고리 목록 조회 추가
    getCategoryList: async () => {
      const metadata = (await mockDatabase.findAll()) as Metadata[];
      const categories = [
        ...new Set(metadata.flatMap((item) => item.categories)),
      ]; // ✅ 중복 제거
      return categories;
    },
  },

  Mutation: {
    addMetadata: async (
      _: any,
      { filePath, categories }: { filePath: string; categories: string[] },
    ) => {
      try {
        const photo = await extractPhotoMetadata(filePath);
        const insertedPhoto = await mockDatabase.insert({
          ...photo,
          categories,
        });

        console.log('Metadata added:', insertedPhoto);
        return insertedPhoto;
      } catch (error) {
        console.error('Error adding metadata:', error);
        throw new Error('Failed to add metadata');
      }
    },
    // ID로 메타데이터 삭제
    deleteById: async (_: any, { id }: { id: string }) => {
      const success = await mockDatabase.deleteById(id); // Mock DB에서 비동기 삭제
      console.log('Delete Metadata by ID:', id, success); // 디버깅용 로그
      return success; // 삭제 성공 여부 반환
    },
  },
};
