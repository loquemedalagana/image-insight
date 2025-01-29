import client from '@/lib/apolloClient';
import {
  GetMetadataDocument,
  GetMetadataQuery,
  GetMetadataQueryVariables,
  Exact,
} from '__generated__/graphql';
import { ApolloError, QueryResult } from '@apollo/client';
import ApolloErrorPageComponent from '@/components/error/ApolloErrorPageComponent';

export default async function Home() {
  try {
    const queryVariables: GetMetadataQueryVariables = {
      dummy: true,
    };

    const { data } = (await client.query({
      query: GetMetadataDocument,
      variables: queryVariables,
    })) as QueryResult<GetMetadataQuery, Exact<{ [key: string]: never }>>;

    return (
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {JSON.stringify(data?.metadata)}
        </div>
      </main>
    );
  } catch (e) {
    console.error(e);

    if (e instanceof ApolloError) {
      return <ApolloErrorPageComponent error={e} />;
    }

    return <div>Unexpected error occurred</div>;
  }
}
