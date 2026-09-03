import IORedis from 'ioredis';

/**
 * IORedis connection singleton for BullMQ job queues.
 *
 * Reuses the same connection across hot reloads in development.
 * BullMQ requires IORedis (not the generic `redis` package).
 */

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const globalForRedis = globalThis as unknown as {
  redis: IORedis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

/**
 * Create a new IORedis connection (for BullMQ workers that need dedicated connections).
 */
export function createRedisConnection(): IORedis {
  return new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}
