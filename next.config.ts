import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
    // Product/banner images are managed in the admin and may live on any https host.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      // Local backend uploads during development (see backend PUBLIC_URL).
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
};

export default nextConfig;
