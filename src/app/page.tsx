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
      <main className="flex flex-col gap-8 items-center sm:items-start p-4">
        {/* Masonry 레이아웃 */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {data?.metadata?.map((item, index) => (
            <div
              key={index}
              className="break-inside-avoid mb-4 rounded-lg shadow-lg bg-white p-2"
            >
              <img
                src={item.imageUrl} // 가정: `metadata`에 `imageUrl`이 있다고 가정
                alt={item.fileName || 'Image'}
                className="w-full h-auto rounded-md"
              />
              <h3 className="text-lg font-bold mt-2">{item.fileName}</h3>
              <p className="text-sm text-gray-600">{item.category}</p>
            </div>
          ))}
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
