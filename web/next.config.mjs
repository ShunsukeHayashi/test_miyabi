/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  // Performance: Image Optimization
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
    formats: ['image/webp', 'image/avif'],
  },

  // Performance: Compression
  compress: true, // Enable gzip compression

  // Performance: Production Optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundles
  poweredByHeader: false, // Remove X-Powered-By header for security

  // Performance: React optimizations
  reactStrictMode: true,
  swcMinify: true, // Use SWC for faster minification

  // Performance: Package optimization
  experimental: {
    optimizePackageImports: ['@/lib', '@/components', 'lucide-react', '@radix-ui/react-icons'],
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Output file tracing root
  outputFileTracingRoot: process.env.OUTPUT_FILE_TRACING_ROOT,
};

export default nextConfig;
