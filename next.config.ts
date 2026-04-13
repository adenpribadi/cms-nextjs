import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize native/complex modules so webpack does NOT bundle them.
  // They are loaded from node_modules at runtime instead.
  // This is required for: better-sqlite3 (local dev), @libsql/client (Turso production)
  serverExternalPackages: [
    "better-sqlite3",
    "@prisma/adapter-better-sqlite3",
    "@libsql/client",
    "@prisma/adapter-libsql",
    "bcryptjs",
  ],
};

export default nextConfig;
