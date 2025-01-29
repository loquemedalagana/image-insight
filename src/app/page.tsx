import client from '@/lib/apolloClient';
import {
  Category,
  Exact,
  GetCategoryListDocument,
  GetCategoryListQuery,
} from '__generated__/graphql';
import { ApolloError, QueryResult } from '@apollo/client';
import ApolloErrorPageComponent from '@/components/error/ApolloErrorPageComponent';
import CategoryFilter from '@/components/filter/CategoryFilter';
// import MasonryImageList from '@/components/masonry/MasonryImageList';

export default async function Home() {
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

    // ✅ 2. 데이터베이스가 초기화된 후 GraphQL 쿼리 실행
    const { data } = (await client.query({
      query: GetCategoryListDocument,
    })) as QueryResult<GetCategoryListQuery, Exact<{ [key: string]: never }>>;

    // ✅ 3. GraphQL 데이터가 없을 경우 처리
    const categories = data?.getCategoryList || [];

    return (
      <main className="flex flex-col gap-8 items-center sm:items-start p-4 w-full min-h-screen">
        {/* ✅ 초기 데이터만 `CategoryFilter`에 전달 (추가 쿼리 필요 없음) */}
        {data?.getCategoryList ? (
          <CategoryFilter
            initialCategories={data.getCategoryList as Category[]}
          />
        ) : (
          <p>🚀 No categories found.</p>
        )}
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
