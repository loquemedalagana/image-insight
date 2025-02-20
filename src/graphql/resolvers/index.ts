import { extractMetadataFromLocal } from '@/lib/extractMetadataFromLocal';
import { mockDatabase } from '@/lib/mockDB';
import { extractPhotoMetadata } from '@/utils/metadataUtils';
import {
  Metadata,
  MetadataSearchCondition,
  Category,
} from '__generated__/graphql';

export const resolvers = {
  Query: {
    metadata: async (
      _: any,
      { searchCondition }: { searchCondition?: MetadataSearchCondition },
    ) => {
      const metadata = (await mockDatabase.findAll()) as Metadata[];

      // ✅ 검색 조건이 없으면 전체 데이터 반환
      if (!searchCondition || Object.keys(searchCondition).length === 0) {
        return metadata;
      }

      return metadata.filter((item) => {
        const categoryMatch =
          !searchCondition.categoryName ||
          item.categories.some(
            (category) => category.name === searchCondition.categoryName,
          );

        const fileNameMatch =
          !searchCondition.fileName ||
          item.fileName.includes(searchCondition.fileName);

        return categoryMatch && fileNameMatch;
      });
    },

    // ID로 메타데이터 조회
    metadataById: async (_: any, { id }: { id: string }) => {
      const metadata = await mockDatabase.findById(id);
      console.log('Metadata by ID:', id, metadata);
      return metadata || null;
    },

    // ✅ 카테고리 목록 조회 추가 (id, name 포함)
    getCategoryList: async () => {
      const metadata = (await mockDatabase.findAll()) as Metadata[];
      const categoryMap = new Map<string, Category>();

      metadata.forEach((item) => {
        item.categories.forEach((category) => {
          if (!categoryMap.has(category.id)) {
            categoryMap.set(category.id, category);
          }
        });
      });

      return Array.from(categoryMap.values()); // ✅ 중복 제거 후 반환
    },
  },

  Mutation: {
    addMetadata: async (
      _: any,
      { filePath, categoryIds }: { filePath: string; categoryIds: string[] },
    ) => {
      try {
        const photo = await extractPhotoMetadata(filePath);

        // ✅ categoryIds를 기반으로 실제 카테고리 객체 찾기
        const categories = categoryIds
          .map((id) => mockDatabase.findCategoryById(id))
          .filter((category) => category !== null) as Category[];

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

    // ✅ 새로운 카테고리 추가 기능
    addCategory: async (_: any, { name }: { name: string }) => {
      const existingCategory = mockDatabase.findCategoryByName(name);
      if (existingCategory) {
        return existingCategory; // ✅ 이미 존재하는 경우 반환
      }

      const newCategory = await mockDatabase.insertCategory({ name });
      console.log('Category added:', newCategory);
      return newCategory;
    },

    // ID로 메타데이터 삭제
    deleteMetadataById: async (_: any, { id }: { id: string }) => {
      const success = await mockDatabase.deleteById(id);
      console.log('Delete Metadata by ID:', id, success);
      return success;
    },
  },
};
