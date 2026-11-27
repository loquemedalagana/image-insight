// 테스트용 fixture 이미지를 다시 만드는 스크립트 (node tests/fixtures/generate.mjs)
// - 합성 그라디언트 이미지라서 인물·위치 정보가 없다.
// - with-exif.jpg: 가짜 카메라 EXIF를 심는다(GPS 없음). no-exif.jpg: EXIF 없음.
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'samples');
const width = 96;
const height = 64;

const gradient = (r, g, b) => {
  const buf = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      buf[i] = Math.round((x / width) * r);
      buf[i + 1] = Math.round((y / height) * g);
      buf[i + 2] = b;
    }
  }
  return sharp(buf, { raw: { width, height, channels: 3 } });
};

await fs.mkdir(path.join(root, 'landscape'), { recursive: true });
await fs.mkdir(path.join(root, 'plain'), { recursive: true });

await gradient(255, 180, 90)
  .withExif({
    IFD0: {
      Make: 'FixtureCam',
      Model: 'FX-1',
      Software: 'image-insight test fixture',
    },
    IFD2: {
      ExposureTime: '1/250',
      FNumber: '28/10',
      ISOSpeedRatings: '200',
      FocalLength: '50/1',
      DateTimeOriginal: '2025:01:26 12:00:00',
      LensModel: 'Fixture 50mm F2.8',
    },
  })
  .jpeg({ quality: 80 })
  .toFile(path.join(root, 'landscape', 'with-exif.jpg'));

await gradient(90, 255, 200)
  .jpeg({ quality: 80 })
  .toFile(path.join(root, 'plain', 'no-exif.jpg'));

console.log('fixtures written to', root);
