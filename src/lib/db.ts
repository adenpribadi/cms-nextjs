import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  let url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not defined");

  // Fix for SQLite file paths to be absolute
  const dbPath = url.startsWith("file:") ? url.replace("file:", "") : url;
  const absolutePath = path.resolve(process.cwd(), "prisma", dbPath);

  console.log("Prisma initializing with absolute path:", absolutePath);
  
  // In Prisma 7, the Better-SQLite3 adapter expects a config object with a URL
  const adapter = new PrismaBetterSqlite3({ url: `file:${absolutePath}` });
  
  return new PrismaClient({ adapter });
};

export const db = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
