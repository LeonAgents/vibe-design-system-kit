import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ['echarts', 'zrender'],

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  reactStrictMode: true,
};

export default nextConfig;
