import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kill Next.js DevTools / nextjs-portal / red "N Issue" badge entirely.
  // Requires a full `next dev` restart to take effect.
  devIndicators: false,
};

export default nextConfig;
