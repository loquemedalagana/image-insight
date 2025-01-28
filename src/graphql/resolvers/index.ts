import { extractMetadata } from '@/lib/extractMetadata';
import { mockDatabase } from '@/lib/mockDB'; // Mock DB를 사용

export const resolvers = {
  Query: {
    // 전체 메타데이터 조회
    metadata: async () => {
      // 메타데이터 추출
      const metadata = await extractMetadata();

      // Mock DB 초기화 및 데이터 저장
      await mockDatabase.clear();
      metadata.forEach((item) => mockDatabase.insert(item));

      console.log('Extracted Metadata:', metadata); // 디버깅용 로그
      return metadata;
    },

    // ID로 메타데이터 조회
    metadataById: async (_: any, { id }: { id: string }) => {
      const metadata = mockDatabase.findById(id); // Mock DB에서 검색
      console.log('Metadata by ID:', id, metadata); // 디버깅용 로그
      return metadata || null; // 데이터가 없으면 null 반환
    },
  },

  Mutation: {
    // ID로 메타데이터 삭제
    deleteById: async (_: any, { id }: { id: string }) => {
      const success = mockDatabase.deleteById(id); // Mock DB에서 삭제
      console.log('Delete Metadata by ID:', id, success); // 디버깅용 로그
      return success; // 삭제 성공 여부 반환
    },
  },
};
