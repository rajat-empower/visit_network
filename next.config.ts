import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['visitslovenia.b-cdn.net', 'visitslovenia.com'],
  },
  experimental: {
    optimizeCss: true,
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable ESLint during build
  eslint: {
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;
