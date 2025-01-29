import client from '@/lib/apolloClient';
import {
  GetMetadataDocument,
  GetMetadataQuery,
  GetMetadataQueryVariables,
  Exact,
  MetadataSearchCondition,
} from '__generated__/graphql';
import { ApolloError, QueryResult } from '@apollo/client';
import ApolloErrorPageComponent from '@/components/error/ApolloErrorPageComponent';

export default async function Home({
  searchParams,
}: {
  searchParams: MetadataSearchCondition;
  // TODO: page, size, sort, etc.
}) {
  try {
    const queryVariables: GetMetadataQueryVariables = {
      searchCondition: searchParams,
    };

    const { data } = (await client.query({
      query: GetMetadataDocument,
      variables: queryVariables,
    })) as QueryResult<GetMetadataQuery, Exact<{ [key: string]: never }>>;

    return (
      <main className="flex flex-col gap-8 items-center sm:items-start p-4 w-full min-h-screen">
        {/* Masonry 레이아웃 */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 w-full">
          {data?.metadata?.map((item, index) => (
            <div
              key={index}
              className="break-inside-avoid mb-4 rounded-lg shadow-lg dark:shadow-gray-700 bg-white dark:bg-gray-800 p-2"
            >
              <img
                src={item.imageUrl}
                alt={item.fileName || 'Image'}
                className="w-full h-auto rounded-md"
              />
              <h3 className="text-lg font-bold mt-2 text-gray-900 dark:text-gray-100">
                {item.fileName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.categories?.join(', ')}
              </p>
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
