/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
typescript: {
  ignoreBuildErrors: true, // Disables TypeScript build-time errors
},
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
