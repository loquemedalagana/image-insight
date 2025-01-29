import fs from 'fs/promises';
import path from 'path';

// ✅ 비동기 Generator 기반 디렉토리 탐색
export async function* getAllImagesAsync(dir: string): AsyncGenerator<string> {
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      yield* getAllImagesAsync(itemPath); // ✅ 재귀적으로 탐색
    } else if (item.isFile() && /\.(jpe?g|JPE?G|cr3|CR3)$/i.test(item.name)) {
      yield itemPath; // ✅ Lazy Evaluation (하나씩 반환)
    }
  }
}