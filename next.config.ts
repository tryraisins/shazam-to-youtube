/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.csv': {
          loaders: ['file-loader'],
        },
      },
    },
  },
};

module.exports = nextConfig;