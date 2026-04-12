import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent native modules from being bundled by Turbopack/webpack.
  // better-sqlite3 is a native node addon — it cannot be bundled into
  // a serverless function. On Vercel, we use Turso (libsql) instead.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
