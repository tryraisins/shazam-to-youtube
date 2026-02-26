import { LRUCache } from "lru-cache";

interface RateLimitConfig {
  interval: number; // Time window in ms
  maxRequests: number; // Max requests per window
}

// Different limits for different endpoint types
export const RATE_LIMITS = {
  // Moderate for sensitive operations
  api: { interval: 60 * 1000, maxRequests: 60 }, // 60 per minute
  upload: { interval: 60 * 1000, maxRequests: 10 }, // 10 per minute

  // Relaxed for general use
  public: { interval: 60 * 1000, maxRequests: 100 }, // 100 per minute
};

// In-memory rate limiter
const rateLimitCache = new LRUCache<string, number[]>({
  max: 10000,
  ttl: 60 * 60 * 1000, // 1 hour
});

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const windowStart = now - config.interval;

  const requests = rateLimitCache.get(identifier) || [];
  const recentRequests = requests.filter((time) => time > windowStart);

  if (recentRequests.length >= config.maxRequests) {
    const oldestRequest = Math.min(...recentRequests);
    const retryAfter = Math.ceil(
      (oldestRequest + config.interval - now) / 1000,
    );

    return {
      allowed: false,
      remaining: 0,
      retryAfter,
    };
  }

  recentRequests.push(now);
  rateLimitCache.set(identifier, recentRequests);

  return {
    allowed: true,
    remaining: config.maxRequests - recentRequests.length,
  };
}
