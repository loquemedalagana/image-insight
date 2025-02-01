import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      '.next/', // 빌드 디렉토리 무시
      'node_modules/', // 모듈 디렉토리 무시
      'src/__generated__/', // 특정 파일 무시
    ],
    rules: {
      // 🔹 `{}` 빈 객체 타입 사용 방지 관련 규칙 (허용할 경우 object 또는 unknown 사용)
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowObjectTypes: true },
      ],

      // 🔹 미사용 변수 경고 처리 (빌드 실패 방지) + _로 시작하는 변수 무시
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      // 🔹 Next.js에서 `<img>` 태그 사용 경고 비활성화
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
