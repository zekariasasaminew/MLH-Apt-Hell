import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75],
    remotePatterns: [new URL("https://images.unsplash.com/**")],
  },
};

export default nextConfig;
