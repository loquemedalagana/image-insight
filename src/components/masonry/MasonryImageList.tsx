import {
  GetMetadataDocument,
  GetMetadataQuery,
  GetMetadataQueryVariables,
} from '__generated__/graphql';

interface MasonryImageListProps {
  data: GetMetadataQuery;
}
export default function MasonryImageList({ data }: MasonryImageListProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 w-full">
      {data?.metadata?.map((item, index) => (
        <div
          key={index}
          className="break-inside-avoid mb-4 rounded-lg shadow-lg bg-white p-2"
        >
          <img
            src={item.imageUrl}
            alt={item.fileName || 'Image'}
            className="w-full h-auto rounded-md"
          />
          <h3 className="text-lg font-bold mt-2 dark:text-black">
            {item.fileName}
          </h3>
          <p className="text-sm text-gray-600">
            {item.categories.map((c) => c.name).join(', ')}
          </p>
        </div>
      ))}
    </div>
  );
}
