/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      // BytePlus CDN domains
      {
        protocol: 'https',
        hostname: '*.byteplus.com',
      },
      {
        protocol: 'https',
        hostname: '*.bytepluses.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.byteplus.com',
      },
      {
        protocol: 'https',
        hostname: 'ark.ap-southeast.bytepluses.com',
      },
      // Allow other HTTPS images for development
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@/lib', '@/components'],
  },
};

export default nextConfig;
