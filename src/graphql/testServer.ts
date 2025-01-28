import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '@/graphql/schema/index';
import { resolvers } from '@/graphql/resolvers/index';

export const createTestServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};
