import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos"],
  },
  remotePatterns: [
  {
    protocol: "http",
    hostname: "localhost",
    port: "4000",
    pathname: "/**",
  },
]
};

export default nextConfig;
