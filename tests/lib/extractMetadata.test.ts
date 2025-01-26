// Placeholder test for metadata extraction logic
import { extractMetadata } from '@/lib/extractMetadata';

test('extractMetadata should return metadata for sample images', async () => {
  const metadata = await extractMetadata();
  expect(metadata).toBeInstanceOf(Array);
  expect(metadata.length).toBeGreaterThan(0);
  expect(metadata[0]).toHaveProperty('fileName');
  expect(metadata[0]).toHaveProperty('width');
  expect(metadata[0]).toHaveProperty('height');
});
