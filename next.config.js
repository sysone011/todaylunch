/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/todaylunch',
  assetPrefix: '/todaylunch/',
  trailingSlash: true,
}

module.exports = nextConfig 