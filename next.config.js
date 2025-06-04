
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  serverExternalPackages: ['@node-rs/argon2', '@supabase/auth-helpers-nextjs'],
  experimental: {
    forceSwcTransforms: true,
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.replit.dev']
    },
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Faster builds - swcMinify is now default in Next.js 13+
  
  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Security headers
  poweredByHeader: false,
  reactStrictMode: true,
  
  // TypeScript and ESLint
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Optimize for development
    if (dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: false,
        providedExports: false,
        sideEffects: false,
      };
    }
    
    return config;
  },
  
  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
             key: 'Strict-Transport-Security',
             value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            value: process.env.NODE_ENV === 'development' ? '*' : 'https://*.replit.dev'
          },
          { 
            key: 'Access-Control-Allow-Methods', 
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' 
          },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' 
          },
        ]
      }
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/intern',
        permanent: false,
      },
    ];
  },
  
  // Development optimizations
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Production settings
  output: 'standalone',
  
  // Reduce initial JavaScript bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
}

module.exports = nextConfig
