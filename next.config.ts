import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "khotaikhoan.net",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
