
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    minimumCacheTTL: 60,
  },
  swcMinify: true,
  experimental: {
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
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack']
      }
    },
    serverActions: true,
    optimizeServerReact: true
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
