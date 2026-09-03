import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname),
  serverExternalPackages: [
    "bullmq",
    "ioredis",
    "sharp",
    "imghash",
    "@prisma/client",
    "bcryptjs",
  ],
};

export default nextConfig;