/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: true, // для Next.js 16
  },
  typescript: {
    ignoreBuildErrors: true, // игнорируем TS-ошибки в сборке
  },
};

module.exports = nextConfig;