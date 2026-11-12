import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      {
        // Hero photos are static files: let browsers and the CDN keep them for a day.
        source: "/hero_image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // The cover page used to live at /portada; it is now the home page.
      { source: "/portada", destination: "/", permanent: false },
      // The old home page (featured homes) was removed; the inventory replaces it.
      { source: "/inicio", destination: "/", permanent: false },
      { source: "/autos", destination: "/casas", permanent: true },
      { source: "/autos/:id", destination: "/casas/:id", permanent: true },
      // Canonical host is www; Vercel already forces HTTPS.
      {
        source: "/:path*",
        has: [{ type: "host", value: "tuproximacasa.online" }],
        destination: "https://www.tuproximacasa.online/:path*",
        permanent: true,
      },
      // The agency directory moved from /concesionarias to /inmobiliarias.
      { source: "/concesionarias", destination: "/inmobiliarias", permanent: true },
      { source: "/concesionarias/:slug", destination: "/inmobiliarias/:slug", permanent: true },
      {
        source: "/dashboard/leads",
        destination: "/dashboard/interesados",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "ik.imagekit.io", pathname: "/4soxndpvzw/**" },
    ],
  },
  turbopack: {
    // Pin the root: a stray package-lock.json in a parent folder makes Next infer the wrong one.
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
