import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Reloaded Turbopack loader config
  cacheComponents: true,
  partialPrefetching: true,
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
