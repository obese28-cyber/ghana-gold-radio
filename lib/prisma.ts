import { PrismaClient } from '@prisma/client';

/**
 * Prisma client singleton. In dev, Next.js hot-reloads modules, which would
 * otherwise create a new PrismaClient (and a new DB connection pool) on
 * every edit. Stashing the instance on globalThis avoids that.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
