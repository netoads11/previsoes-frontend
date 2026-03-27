import type { NextConfig } from "next";

// INTERNAL_API_URL é usado server-side (dentro do Docker). Se não definido, usa NEXT_PUBLIC_API_URL.
const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://187.77.248.115:3001';

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${API_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
