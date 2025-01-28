import { extractMetadata } from '@/lib/extractMetadata';

export const resolvers = {
  Query: {
    metadata: async () => {
      return await extractMetadata();
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
