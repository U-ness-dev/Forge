import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let cachedUrl: string | null = null

function getDbUrl() {
  if (cachedUrl) return cachedUrl
  cachedUrl = process.env.DATABASE_URL || "file:./forge.db"
  return cachedUrl
}

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    const url = getDbUrl()
    const adapter = new PrismaBetterSqlite3({ url })
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }
  return globalForPrisma.prisma
}

export const prisma = getPrisma()
