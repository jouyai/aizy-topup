/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['aceternity-ui'],
  env: {
    BROWSERSLIST_STATS: 'ignore',
  },
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
