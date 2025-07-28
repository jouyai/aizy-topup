/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['aceternity-ui'],
  env: {
    BROWSERSLIST_STATS: 'ignore',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
        port: '',
        pathname: '/mobile-legends/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ourastore.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'cdn.ourastore.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.bangjeff.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;