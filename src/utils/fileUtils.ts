import fs from 'fs';
import path from 'path';

export const getAllImages = (dir: string): string[] => {
  return fs.readdirSync(dir).flatMap((item) => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      return getAllImages(itemPath); // 하위 디렉토리 탐색
    } else if (stats.isFile() && /\.(jpe?g|JPE?G|cr3|CR3)$/i.test(item)) {
      return itemPath; // 이미지 파일만 반환
    }
    return [];
  });
};
