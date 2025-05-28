import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   ignoreBuildErrors: true,
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;