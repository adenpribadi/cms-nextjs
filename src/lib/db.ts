import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const isProduction = process.env.NODE_ENV === "production";
  const hasTurso = !!process.env.TURSO_AUTH_TOKEN;

  // Production on Vercel with Turso cloud database
  if (isProduction && hasTurso) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSQL } = require("@prisma/adapter-libsql");

    const databaseUrl = process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!databaseUrl) throw new Error("DATABASE_URL is not defined");

    const libsql = createClient({ url: databaseUrl, authToken });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  // Local development with better-sqlite3
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path");

  const url = process.env.DATABASE_URL || "";
  const dbPath = url.startsWith("file:") ? url.replace("file:", "") : url;
  const absolutePath = path.resolve(process.cwd(), "prisma", dbPath);

  console.log("Prisma initializing with absolute path:", absolutePath);

  const adapter = new PrismaBetterSqlite3({ url: `file:${absolutePath}` });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
