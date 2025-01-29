import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { extractMetadataFromLocal } from '@/lib/extractMetadataFromLocal';
import { mockDatabase } from '@/lib/mockDB';

// ✅ 서버 시작 시 데이터 초기화
async function initializeDatabase() {
  console.log('🚀 Initializing database from local files...');

  const metadata = await extractMetadataFromLocal();
  await mockDatabase.clear(); // 기존 데이터 제거
  await mockDatabase.initializeDatabase(metadata); // ✅ 데이터 삽입

  console.log(`✅ Database initialized with ${metadata.length} items.`);
}

// ✅ Apollo Server 생성
export const createServer = async () => {
  if (!mockDatabase.isReady) {
    await initializeDatabase(); // 🚀 서버가 준비되지 않았다면 초기화 실행
  }

  return new ApolloServer<{
    req: NextApiRequest;
    res: NextApiResponse;
  }>({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    introspection: true, // 개발 환경에서 Playground 활성화
  });
};

// ✅ Next.js API 핸들러 생성
export const createHandler = async () => {
  const server = await createServer();
  return startServerAndCreateNextHandler(server, {
    context: async (integrationContext) => {
      const { req, res } = integrationContext as unknown as {
        req: NextApiRequest;
        res: NextApiResponse;
      };
      return { req, res };
    },
  });
};
