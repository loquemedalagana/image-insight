export interface ExifData {
  // 기본 카메라 정보
  make: string;
  model: string;
  iso: number;
  exposureTime: number; // 초 단위 (예: 0.0025)
  fNumber: number;
  focalLength: number; // mm 단위로 변환된 값
  dateTimeOriginal: string;

  // 이미지 및 센서 크기 정보 (내재 행렬 계산에 필요)
  exifImageWidth: number; // 예: 6000
  exifImageHeight: number; // 예: 4000
  orientation: string; // 예: "Horizontal (normal)"
  xResolution: number; // 예: 72
  yResolution: number; // 예: 72
  resolutionUnit: string; // 예: "inches"

  // 초점면 관련 해상도 (픽셀 크기 계산 등에 사용)
  focalPlaneXResolution: number;
  focalPlaneYResolution: number;
  focalPlaneResolutionUnit: string;

  // 색상 및 보정 정보
  whitePoint: [number, number]; // 예: [0.313, 0.329]
  primaryChromaticities: [number, number, number, number, number, number]; // 예: [0.64, 0.33, 0.21, 0.71, 0.15, 0.06]
  gamma: number; // 예: 2.2 – 감마 인코딩/디코딩 시 필요
  colorSpace: number | string; // 원시값(예: 65535) 혹은 sRGB 등

  // GPS 정보
  gps:
    | {
        latitude: number;
        longitude: number;
      }
    | 'No GPS data';

  // 추가 초점/거리 정보 (필요에 따라 캘리브레이션 알고리즘에 사용)
  subjectDistance: number;
  focusDistance: number;

  // 렌즈 관련 정보 (렌즈 왜곡 보정 등에 활용)
  lensModel: string;
}

// `processExif`가 데이터를 반환하지 못할 경우를 대비한 타입 추가
export type ProcessExifReturn = ExifData | { message: string } | null;
