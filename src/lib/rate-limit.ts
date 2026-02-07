interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
}

export function rateLimiter(config: RateLimitConfig) {
  const { limit, windowMs } = config;
  const store = new Map<string, RateLimitEntry>();

  // Cleanup expired entries every 60 seconds
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now >= entry.resetTime) {
        store.delete(key);
      }
    }
  }, 60_000);

  // Allow garbage collection in serverless environments
  if (cleanup.unref) {
    cleanup.unref();
  }

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || now >= entry.resetTime) {
        store.set(key, { count: 1, resetTime: now + windowMs });
        return { success: true, remaining: limit - 1 };
      }

      entry.count++;

      if (entry.count > limit) {
        return { success: false, remaining: 0 };
      }

      return { success: true, remaining: limit - entry.count };
    },
  };
}
