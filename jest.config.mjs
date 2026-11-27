export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './', // 프로젝트 루트 설정
  setupFiles: ['<rootDir>/tests/setupEnv.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json', useESM: true }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // ESM 처리할 확장자
  transformIgnorePatterns: ['/node_modules/(?!your-esm-lib)'],
  globals: {},
};
