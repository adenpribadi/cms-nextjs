import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  // ── ROCK-SOLID BUILD MOCK ──────────────────────────────────────────
  // If we are on Vercel and the DATABASE_URL is either missing or set to the byproduct 
  // "undefined", we MUST use the Mock Client to avoid a guaranteed engine crash 
  // during static generation.
  const isVercel = process.env.VERCEL === "1";
  const rawUrl = process.env.DATABASE_URL || "";
  const isInvalidUrl = !rawUrl || rawUrl === "undefined";
  
  if (isVercel && isInvalidUrl) {
    console.info("Prisma: Vercel environment with missing/invalid URL detected. Using Safe-Mock Client.");
    return createMockClient();
  }

  try {
    let currentUrl = rawUrl;

    // Always ensure process.env has a valid string for the engine's internal validation
    if (rawUrl) {
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

    const dbPath = rawUrl.replace(/^file:/, "");
    const absolutePath = path.isAbsolute(dbPath) 
      ? dbPath 
      : path.resolve(process.cwd(), dbPath);

    const adapter = new PrismaBetterSqlite3({ url: absolutePath });
    return new PrismaClient({ adapter });

  } catch (error) {
    console.error("Prisma: Initialization error:", error);
    // Fallback if everything else fails during build (as a safety net)
    if (process.env.VERCEL) {
      return createMockClient();
    }
    throw error;
  }
}

/**
 * Creates a Proxy-based Prisma Client that returns empty arrays/values 
 * for all queries to prevent build crashes.
 */
function createMockClient(): PrismaClient {
  return new Proxy({} as any, {
    get: (_, prop) => {
      if (prop === '$on' || prop === '$connect' || prop === '$disconnect' || prop === '$use') {
        return () => Promise.resolve();
      }
      if (prop === 'then') return undefined;
      
      return new Proxy({}, {
        get: (__, modelProp) => {
          const asyncMethods = ['findMany', 'findUnique', 'findFirst', 'count', 'aggregate', 'groupBy', 'update', 'create', 'delete', 'upsert'];
          if (asyncMethods.includes(modelProp as string)) {
            return () => Promise.resolve(modelProp === 'count' ? 0 : (typeof modelProp === 'string' && modelProp.startsWith('find') ? null : []));
          }
          return undefined;
        }
      });
    }
  }) as unknown as PrismaClient;
}





export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
