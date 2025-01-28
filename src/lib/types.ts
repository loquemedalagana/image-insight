export interface ExifData {
  make: string;
  model: string;
  iso: number;
  exposureTime: string;
  fNumber: string;
  focalLength: string;
  dateTimeOriginal: string;
  gps:
    | {
        latitude: number;
        longitude: number;
      }
    | 'No GPS data';
}

// `processExif`가 데이터를 반환하지 못할 경우를 대비한 타입 추가
export type ProcessExifReturn = ExifData | { message: string } | null;
