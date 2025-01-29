'use client';

import { Category } from '__generated__/graphql';
import { useSearchParams, useRouter } from 'next/navigation';

interface Props {
  initialCategories: Category[]; // ✅ 서버에서 받은 초기 데이터
}

export default function CategoryFilter({ initialCategories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCategory = searchParams.get('categoryName') || '';

  const categories = initialCategories;

  const handleFilterChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('categoryName', category);
    } else {
      params.delete('categoryName');
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center gap-2 p-4 border-b border-gray-300 dark:border-gray-700">
      <button
        onClick={() => handleFilterChange('')}
        className={`px-3 py-1 rounded transition-colors duration-200
          ${
            !selectedCategory
              ? 'bg-blue-500 text-white dark:bg-blue-400 dark:text-gray-900'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }
        `}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleFilterChange(category.name)}
          className={`px-3 py-1 rounded transition-colors duration-200
            ${
              selectedCategory === category.name
                ? 'bg-blue-500 text-white dark:bg-blue-400 dark:text-gray-900'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            }
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
