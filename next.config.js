/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'agrimind-uploads.s3.amazonaws.com',
      'agrimind-uploads.s3.ap-south-1.amazonaws.com',
    ],
  },
}

module.exports = nextConfig
