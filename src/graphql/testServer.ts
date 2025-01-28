import { ApolloServer } from '@apollo/server';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';

export const createTestServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};
