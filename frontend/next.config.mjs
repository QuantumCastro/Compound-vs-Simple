/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  experimental: {
    typedRoutes: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
