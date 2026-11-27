import fs from 'fs/promises';
import path from 'path';

// 샘플 이미지 폴더. 기본은 public/samples, 테스트에서는 SAMPLES_DIR로 fixture 폴더를 가리킨다.
export const getSamplesDir = (): string =>
  path.resolve(process.cwd(), process.env.SAMPLES_DIR || 'public/samples');

export const OUTSIDE_SAMPLES_MESSAGE =
  'filePath must point to a file inside the samples directory';

const isInside = (dir: string, target: string) =>
  target.startsWith(dir + path.sep);

/**
 * 클라이언트가 보낸 파일 경로를 검증하고 실제 경로를 돌려준다.
 * 샘플 폴더를 벗어나는 경로(`../`, 폴더 밖 절대 경로, 폴더 밖을 가리키는 심볼릭 링크)와
 * 존재하지 않는 파일은 거부한다.
 */
export const resolveSamplePath = async (filePath: string): Promise<string> => {
  const samplesDir = getSamplesDir();
  const requested = path.resolve(process.cwd(), filePath);

  // 1) 문자열 기준: `..`를 정리한 경로가 샘플 폴더 안인지
  if (!isInside(samplesDir, requested)) {
    throw new Error(OUTSIDE_SAMPLES_MESSAGE);
  }

  // 2) 실제 경로 기준: 심볼릭 링크를 따라간 결과도 샘플 폴더 안인지
  try {
    const [realDir, realFile] = await Promise.all([
      fs.realpath(samplesDir),
      fs.realpath(requested),
    ]);
    if (isInside(realDir, realFile)) return realFile;
  } catch {
    // 존재하지 않는 파일: 아래에서 같은 메시지로 거부
  }
  throw new Error(OUTSIDE_SAMPLES_MESSAGE);
};

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
