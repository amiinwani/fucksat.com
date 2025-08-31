import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/(.*)',
        destination: 'https://sat.cuirolearn.co/generate/khan-algebra',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
