import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
};

module.exports = {
  output: "standalone",
};

export default nextConfig;
