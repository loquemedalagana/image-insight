import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // 'graphql' 모듈 중복 문제 해결
    config.externals = [...(config.externals || []), 'graphql'];
    return config;
  },
  reactStrictMode: true, // React Strict Mode 활성화
};

export default nextConfig;
