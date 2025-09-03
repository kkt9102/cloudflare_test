import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ktkim9102.com:3307/:path*",
      },
    ];
  },
};

export default nextConfig;
