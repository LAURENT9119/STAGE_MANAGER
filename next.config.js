
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
  images: {
    domains: ['ljboqtmrferkafwfanva.supabase.co'],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    
    // Ignorer les modules optionnels qui causent des warnings
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "bufferutil": false,
      "utf-8-validate": false,
    };
    
    return config;
  },
  // Configuration pour Replit
  async rewrites() {
    return []
  },
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
        ],
      },
    ]
  },
}

module.exports = nextConfig
