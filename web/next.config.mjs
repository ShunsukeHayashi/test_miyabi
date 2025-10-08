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
    formats: ['image/avif', 'image/webp'], // Modern formats for better compression
    minimumCacheTTL: 31536000, // Cache optimized images for 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Thumbnail sizes
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
    optimizePackageImports: ['@/lib', '@/components', 'lucide-react', 'date-fns'],
    webVitalsAttribution: ['CLS', 'LCP'], // Track performance metrics
  },

  // Performance: Output optimization
  output: 'standalone', // Optimize output for Docker/serverless

  // Performance: Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Remove console.log in production, keep errors/warnings
    } : false,
  },
};

export default nextConfig;
