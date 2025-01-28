import { extractMetadata } from '@/lib/extractMetadata';

export const resolvers = {
  Query: {
    metadata: async () => {
      const metadata = await extractMetadata();
      console.log('Extracted Metadata:', metadata); // 디버깅용 로그
      return metadata;
    },
  },
  /*
  TODO: should be updated
  Mutation: {
    deleteImage: async (_: any, { fileName }: { fileName: string }) => {
      // 파일 삭제 로직
      return true;
    },
  }, */
};
