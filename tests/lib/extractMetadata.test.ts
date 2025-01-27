import { extractMetadata } from '@/lib/extractMetadata';

test('extractMetadata should return metadata for sample images', async () => {
  const metadata = await extractMetadata();
  console.log(metadata);

  expect(metadata).toBeInstanceOf(Array);
  expect(metadata.length).toBeGreaterThan(0); // should not be empty
  expect(metadata[0]).toHaveProperty('fileName');
});
