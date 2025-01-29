import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import type { NextApiRequest, NextApiResponse } from 'next';
import { extractMetadataFromLocal } from '@/lib/extractMetadataFromLocal';
import { mockDatabase } from '@/lib/mockDB';

/** ✅ 서버 시작 시 한 번만 실행되는 데이터 초기화 함수 */
async function initializeDatabase() {
  console.log('🚀 Initializing database from local files...');

  const metadata = await extractMetadataFromLocal();
  await mockDatabase.clear(); // 기존 데이터 제거
  for (const item of metadata) {
    await mockDatabase.insert(item);
  }

  console.log(`✅ Loaded ${metadata.length} files into mock database`);
}

/** ✅ Apollo Server 인스턴스 생성 (제네릭 타입 제거) */
export const createServer = (): ApolloServer => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    introspection: true, // 개발 환경에서 Playground 활성화
  });
};

/** ✅ Next.js와 Apollo Server 통합 핸들러 */
export const createHandler = async () => {
  const server = createServer(); // ✅ `await` 제거하여 동기적으로 실행

  return startServerAndCreateNextHandler(server, {
    context: async (integrationContext) => {
      const { req, res } = integrationContext as unknown as {
        req: NextApiRequest;
        res: NextApiResponse;
      };

      // ✅ Next.js 요청 객체가 아닐 수도 있으므로 안전하게 처리
      const headers = (req.headers as Record<string, string | undefined>) || {};
      req.headers['authorization'] = headers['authorization'] || '';

      return { req, res };
    },
  });
};

// ✅ 서버가 처음 실행될 때 데이터 초기화
initializeDatabase().catch(console.error);
