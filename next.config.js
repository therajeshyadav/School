
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost']
  },
  output: 'standalone',   
  typescript: {
    ignoreBuildErrors: true,  
  },
  experimental: {
    missingSuspenseWithCSRBailout: false, 
  },
};

module.exports = nextConfig;
