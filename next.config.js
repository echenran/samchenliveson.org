/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: '/samchenliveson.org/',
  basePath: '/samchenliveson.org',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig