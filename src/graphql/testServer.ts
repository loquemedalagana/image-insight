import { ApolloServer } from '@apollo/server';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { extractMetadataFromLocal } from '@/lib/extractMetadataFromLocal';

export interface GraphQLContext {
  dataSources?: {
    [key: string]: any;
  };
}

export const createTestServer = async () => {
  await extractMetadataFromLocal();

  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};
