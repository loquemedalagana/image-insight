import { NextResponse } from 'next/server';
import { GET } from '@/app/api/metadata/route';

test('API should return metadata for images', async () => {
  // Mock `NextResponse`
  const mockJson = jest.fn();
  jest.spyOn(NextResponse, 'json').mockImplementation(mockJson);

  // Call the API route
  await GET();

  // Verify the response
  expect(mockJson).toHaveBeenCalled();
  const [data] = mockJson.mock.calls[0];
  expect(data).toBeInstanceOf(Array);
  expect(data[0]).toHaveProperty('fileName');
  expect(data[0]).toHaveProperty('category');
});
