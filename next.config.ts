import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:videoId([A-Za-z0-9_-]{11})",
        destination: "https://www.blitzsat.com/generate/youtube/:videoId",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
