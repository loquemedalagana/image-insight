import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BASE_URL } from '@/config';

const isBrowser = typeof window !== 'undefined';
const uri = isBrowser
  ? BASE_URL + '/api/graphql'
  : `${BASE_URL}/api/graphql` || 'http://localhost:3000/api/graphql';

const client = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
});

export default client;
