import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cbtgrinder.com"], // ✅ allow external image loading from this domain
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;