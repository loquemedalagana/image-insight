import client from '@/lib/apolloClient';
import {
  Category,
  Exact,
  GetCategoryListDocument,
  GetCategoryListQuery, GetMetadataDocument, GetMetadataQuery,
  MetadataSearchCondition,
} from '__generated__/graphql';
import { ApolloError, QueryResult } from '@apollo/client';
import ApolloErrorPageComponent from '@/components/error/ApolloErrorPageComponent';
import CategoryFilter from '@/components/filter/CategoryFilter';
// import MasonryImageList from '@/components/masonry/MasonryImageList';

export default async function Home({
  searchParams,
}: {
  searchParams: MetadataSearchCondition & {
    page?: number;
    limit?: number;
  };
}) {
  try {
    // ✅ 1. 먼저 `/api/init-db` 호출하여 데이터베이스 초기화
    const initDbRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/init-db`,
      {
        method: 'GET',
        cache: 'no-store',
      },
    );

    const initDbStatus = await initDbRes.json();

    if (!initDbRes.ok || initDbStatus.error) {
      console.error('❌ Database initialization failed:', initDbStatus.error);
      return (
        <main className="flex flex-col items-center p-4 w-full min-h-screen">
          <h1 className="text-xl font-bold text-red-500">
            Database Initialization Failed
          </h1>
          <p>
            {initDbStatus.error ||
              'Unknown error occurred while initializing database.'}
          </p>
        </main>
      );
    }

    console.log('✅ Database initialized:', initDbStatus.message);

    const { page = 1, limit = 10, ...searchCondition } = await searchParams;

    // ✅ 2. 데이터베이스가 초기화된 후 GraphQL 쿼리 실행

    const { data: categoryListQueryResult } = (await client.query({
      query: GetCategoryListDocument,
    })) as QueryResult<GetCategoryListQuery, Exact<{ [key: string]: never }>>;

    // ✅ 3. GraphQL 데이터가 없을 경우 처리
    const categories = categoryListQueryResult?.getCategoryList || [];

    const { data: metadataQueryResult } = (await client.query({
      query: GetMetadataDocument,
      variables: {
        searchCondition: searchCondition,
      }
    })) as QueryResult<GetMetadataQuery, Exact<{ [key: string]: never }>>;

    console.log('metadataQueryResult', metadataQueryResult?.metadata);


    return (
      <main className="flex flex-col gap-8 items-center p-4 w-full min-h-screen">
        {/* ✅ CategoryFilter를 중앙 정렬 */}
        <div className="flex justify-center w-full">
          {categoryListQueryResult?.getCategoryList ? (
            <CategoryFilter
              initialCategories={categoryListQueryResult.getCategoryList as Category[]}
            />
          ) : (
            <p className="text-center w-full">🚀 No categories found.</p>
          )}
        </div>
        {/* ✅ MasonryImageList도 여기에 추가 가능 */}
        {/* <MasonryImageList images={...} /> */}
      </main>
    );
  } catch (e) {
    console.error('❌ Error in Home component:', e);

    if (e instanceof ApolloError) {
      return <ApolloErrorPageComponent error={e} />;
    }

    return <div>Unexpected error occurred</div>;
  }
}
