import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // 'graphql' 모듈 중복 문제 해결
    config.externals = [...(config.externals || []), 'graphql'];
    return config;
  },
  reactStrictMode: true,
  swcMinify: true, // SWC를 사용한 최적화 활성화
};

export default nextConfig;
