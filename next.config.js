
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.pexels.com'],
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
    optimizeCss: true,
    scrollRestoration: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  webpack: (config, { dev, isServer }) => {
    config.cache = true;
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
};

module.exports = nextConfig;
