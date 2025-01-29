import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { extractMetadataFromLocal } from '@/lib/extractMetadataFromLocal';
import { mockDatabase } from '@/lib/mockDB';

// ✅ 서버 시작 시 한 번만 실행되는 데이터 초기화 함수
async function initializeDatabase() {
  console.log('🚀 Initializing database from local files...');

  const metadata = await extractMetadataFromLocal();
  await mockDatabase.clear(); // 기존 데이터 제거
  for (const item of metadata) {
    await mockDatabase.insert(item);
  }

  console.log(`✅ Loaded ${metadata.length} files into mock database`);
}

// ✅ 서버가 처음 실행될 때 데이터 초기화
initializeDatabase().catch(console.error);

// Apollo Server 생성 함수
export const createServer = () => {
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

// Next.js와 Apollo Server 통합 핸들러 생성 함수
export const createHandler = () => {
  const server = createServer();

  return startServerAndCreateNextHandler(server, {
    context: async (integrationContext) => {
      const { req, res } = integrationContext as unknown as {
        req: NextApiRequest;
        res: NextApiResponse;
      };
      // 컨텍스트 설정 (필요 시 사용자 인증 추가 가능)
      return { req, res };
    },
  });
};
