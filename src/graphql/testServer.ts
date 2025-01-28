import { ApolloServer } from '@apollo/server';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { extractMetadata } from '@/lib/extractMetadata';

export interface GraphQLContext {
  dataSources?: {
    [key: string]: any;
  };
}

export const createTestServer = async () => {
  await extractMetadata();

  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};
