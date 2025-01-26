import { GET } from '@/app/api/metadata/route';

test('API should return metadata for images', async () => {
  const res = await GET(); // API Route 호출
  const data = await res.json();

  expect(data).toBeInstanceOf(Array);
  expect(data[0]).toHaveProperty('fileName');
  expect(data[0]).toHaveProperty('category');
});
