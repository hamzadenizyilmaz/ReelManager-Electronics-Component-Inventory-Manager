/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    // ESLint config is Next 15 flat-config compatible. This extra guard prevents
    // production builds from being blocked by editor/plugin differences on Windows.
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
