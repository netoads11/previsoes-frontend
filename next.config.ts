import type { NextConfig } from "next";

// INTERNAL_API_URL é usado server-side (dentro do Docker). Se não definido, usa NEXT_PUBLIC_API_URL.
const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://ww5y7zdj6dn9y63m6zk4ec7r.187.77.248.115.sslip.io';

const nextConfig: NextConfig = {
  reactCompiler: false,
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
