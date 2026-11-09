import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  devIndicators: false,
  async rewrites() {
    const engineUrl = process.env.POSTARC_INTERNAL_API_URL || "http://127.0.0.1:8080";
    return [
      {
        source: "/api/engine/:path*",
        destination: `${engineUrl}/api/:path*`,
      },
      {
        source: "/api/auth",
        destination: `${engineUrl}/api/auth`,
      },
      {
        source: "/jmap/:path*",
        destination: `${engineUrl}/jmap/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${engineUrl}/auth/:path*`,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
