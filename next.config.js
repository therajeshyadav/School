/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost', 'school-sepia-sigma.vercel.app']
  },
};

module.exports = nextConfig;
