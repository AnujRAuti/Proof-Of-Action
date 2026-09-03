import { PrismaClient } from '@prisma/client';

/**
 * Prisma client singleton for the Proof-of-Action backend.
 *
 * Prevents connection exhaustion during Next.js hot-reload in development.
 * In production, a single PrismaClient instance is created and reused.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
