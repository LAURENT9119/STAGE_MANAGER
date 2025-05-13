/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    fontLoaders: [
      {
        loader: '@next/font/google',
        options: { timeout: 15000 }, // Increase timeout to 15 seconds
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    config.cache = false;
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
};

module.exports = nextConfig;