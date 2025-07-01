// lib/prisma.ts
import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? [
      { level: 'query', emit: 'event' },
      { level: 'info', emit: 'event' },
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ] : ['error'],
  });

// Always implement singleton pattern for all environments
globalForPrisma.prisma = prisma;

// Add query logging only in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
    const transformedQuery = simplifyQuery(e.query, e.params);
    console.log(transformedQuery);
  });
}

function simplifyQuery(
  inputQuery: string,
  params: string,
): string {
  try {
    const paramsObject = JSON.parse(params);
    let simplifiedQuery = inputQuery;
    paramsObject.forEach((param: unknown, index: number) => {
      const value = typeof param === 'string' ? `'${param}'` : String(param);
      simplifiedQuery = simplifiedQuery.replace(
        `$${index + 1}`,
        value,
      );
    });
    return simplifiedQuery;
  } catch (error) {
    console.log('Error parsing query params:', error);
    return inputQuery;
  }
}

// Ensure proper cleanup on process exit
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

console.log('PrismaService singleton initialized');