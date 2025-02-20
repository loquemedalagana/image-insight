// calibrationUtils.ts

export interface CalibratedExifData {
  make: string;
  model: string;
  focalLength: number; // 예: mm 단위로 변환된 값
  normalizedResolution: { x: number; y: number };
  orientation: number; // 예: 0, 90, 180, 270 등
  // 추가로 필요한 계산된 값들...
}

/**
 * 해상도 단위를 고려해 해상도를 정규화합니다.
 */
export const normalizeResolution = (
  xResolution: number,
  yResolution: number,
  resolutionUnit: string,
): { x: number; y: number } => {
  // 예시: resolutionUnit이 'inches'면 DPI를 이용해 픽셀 단위로 변환하는 로직 추가
  if (resolutionUnit === 'inches') {
    return { x: xResolution * 1, y: yResolution * 1 };
  }
  return { x: xResolution, y: yResolution };
};

/**
 * FocalLength 값을 캘리브레이션에 맞게 변환합니다.
 */
export const processFocalLength = (focalLength: number): number => {
  // 필요시 단위 변환이나 보정 값을 적용
  return focalLength; // 기본적으로 그대로 반환하거나 보정 수식을 적용
};

/**
 * Orientation 값을 숫자나 각도로 변환합니다.
 */
export const processOrientation = (orientation: string): number => {
  // 예시: 'Horizontal (normal)' → 0도, 'Rotate 90 CW' → 90도 등으로 매핑
  switch (orientation) {
    case 'Horizontal (normal)':
      return 0;
    // 다른 케이스 처리...
    default:
      return 0;
  }
};

/**
 * 원시 EXIF 데이터를 받아서 캘리브레이션된 데이터 객체로 변환합니다.
 */
export const calibrateExifData = (rawExif: any): CalibratedExifData => {
  return {
    make: rawExif.Make,
    model: rawExif.Model,
    focalLength: processFocalLength(rawExif.FocalLength),
    normalizedResolution: normalizeResolution(
      rawExif.XResolution,
      rawExif.YResolution,
      rawExif.ResolutionUnit,
    ),
    orientation: processOrientation(rawExif.Orientation),
    // 필요한 다른 계산된 값들을 추가
  };
};
