import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import type { NextApiRequest, NextApiResponse } from 'next';

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
