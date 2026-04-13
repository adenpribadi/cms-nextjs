import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  let rawUrl = process.env.DATABASE_URL || "";

  // Handle case where env var might be literally the string "undefined"
  if (rawUrl === "undefined") {
    rawUrl = "";
  }

  // Fallback for build time if we are on Vercel but URL is missing
  if (!rawUrl && process.env.VERCEL) {
    console.warn("WARNING: DATABASE_URL is missing on Vercel. Falling back to local dev.db for build step.");
    rawUrl = "file:./prisma/dev.db";
  }

  // CRITICAL: Explicitly set process.env.DATABASE_URL if it's missing.
  // Prisma Engine validates this environment variable even when using an adapter.
  if (!process.env.DATABASE_URL && rawUrl) {
    process.env.DATABASE_URL = rawUrl;
  }

  if (!rawUrl) {
    throw new Error("DATABASE_URL is not defined. Please set it in your environment variables.");
  }

  // ── Production (Vercel + Turso cloud) ──────────────────────────────
  if (rawUrl.startsWith("libsql://") || rawUrl.startsWith("https://")) {
    const { createClient } = require("@libsql/client");
    const { PrismaLibSql } = require("@prisma/adapter-libsql");

    const authToken = process.env.TURSO_AUTH_TOKEN;
    const libsql = createClient({ url: rawUrl, authToken });
    const adapter = new PrismaLibSql(libsql);
    return new PrismaClient({ adapter });
  }

  // ── Local development (better-sqlite3) ─────────────────────────────
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  const path = require("path");

  // For BetterSqlite3, we need the plain filesystem path.
  const dbPath = rawUrl.replace(/^file:/, "");
  const absolutePath = path.isAbsolute(dbPath) 
    ? dbPath 
    : path.resolve(process.cwd(), dbPath);

  console.log("Prisma initializing with absolute path:", absolutePath);

  // We pass the plain path to the adapter.
  const adapter = new PrismaBetterSqlite3({ url: absolutePath });
  return new PrismaClient({ adapter });
}



export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
