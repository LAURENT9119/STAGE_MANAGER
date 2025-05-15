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
    serverMinification: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-dropdown-menu'
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  reactStrictMode: true,
  compress: true,
  webpack: (config, { dev, isServer }) => {
    config.cache = true;
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
};

module.exports = nextConfig;