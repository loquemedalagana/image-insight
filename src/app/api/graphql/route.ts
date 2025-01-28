import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphql/schema/index';
import { resolvers } from '@/graphql/resolvers/index';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = apolloServer.start();

export default async function handler(req: any, res: any) {
  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
