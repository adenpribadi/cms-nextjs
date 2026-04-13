import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const rawUrl = process.env.DATABASE_URL || "";

  if (!rawUrl) throw new Error("DATABASE_URL is not defined");

  // ── Production (Vercel + Turso cloud) ──────────────────────────────
  if (rawUrl.startsWith("libsql://") || rawUrl.startsWith("https://")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require("@prisma/adapter-libsql");

    const authToken = process.env.TURSO_AUTH_TOKEN;
    const libsql = createClient({ url: rawUrl, authToken });
    const adapter = new PrismaLibSql(libsql);
    return new PrismaClient({ adapter });
  }

  // ── Local development (better-sqlite3) ─────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path");

  const dbPath = rawUrl.startsWith("file:") ? rawUrl.replace("file:", "") : rawUrl;
  const absolutePath = path.resolve(process.cwd(), "prisma", dbPath);

  console.log("Prisma initializing with absolute path:", absolutePath);

  const adapter = new PrismaBetterSqlite3({ url: `file:${absolutePath}` });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
