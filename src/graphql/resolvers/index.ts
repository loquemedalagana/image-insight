import { extractMetadata } from '@/lib/extractMetadata';
import { mockDatabase } from '@/lib/mockDB';
import { extractPhotoMetadata } from '@/utils/metadataUtils';

export const resolvers = {
  Query: {
    // 전체 메타데이터 조회
    metadata: async () => {
      // 메타데이터 추출
      const metadata = await extractMetadata();

      // Mock DB 초기화 및 데이터 저장
      await mockDatabase.clear(); // 비동기 호출
      for (const item of metadata) {
        await mockDatabase.insert(item); // 비동기 삽입
      }

      console.log('Extracted Metadata:', metadata); // 디버깅용 로그
      return metadata;
    },

    // ID로 메타데이터 조회
    metadataById: async (_: any, { id }: { id: string }) => {
      const metadata = await mockDatabase.findById(id); // Mock DB에서 비동기 검색
      console.log('Metadata by ID:', id, metadata); // 디버깅용 로그
      return metadata || null; // 데이터가 없으면 null 반환
    },
  },

  Mutation: {
    addMetadata: async (
      _: any,
      { filePath, category }: { filePath: string; category: string },
    ) => {
      try {
        // 공통 함수 호출
        const photo = await extractPhotoMetadata(filePath, category);

        // DB에 저장
        const insertedPhoto = await mockDatabase.insert(photo);

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
