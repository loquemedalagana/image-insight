export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './', // 프로젝트 루트 설정
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // ESM 처리할 확장자
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json', // TypeScript 설정 파일
      useESM: true, // ESM 활성화
    },
  },
};
