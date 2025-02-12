/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    assetPrefix: '/samchenliveson.org/',
    basePath: '/samchenliveson.org',
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**',
          },
        ],
      },
  };
  
  export default nextConfig;