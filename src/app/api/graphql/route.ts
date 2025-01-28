import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(), // Playground 활성화
  ],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  await server.start();
  await server.createHandler({ path: '/api/graphql' })(req, res);
}
