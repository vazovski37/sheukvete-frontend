import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   ignoreBuildErrors: true,
  // },
    typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;