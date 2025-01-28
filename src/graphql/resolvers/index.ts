import { extractMetadata } from '@/lib/extractMetadata';

export const resolvers = {
  Query: {
    metadata: async () => {
      const metadata = await extractMetadata();
      console.log('Extracted Metadata:', metadata); // 디버깅용 로그
      return metadata;
    },
  },
  Mutation: {
    deleteById: async (_: any, { id }: { id: string }) => {
      console.log('Delete Metadata by ID:', id); // 디버깅용 로그
      return true;
    },
  },
};
