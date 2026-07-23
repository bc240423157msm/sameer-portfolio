/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Good enough to stop casual brute-force / spam on a single-instance
 * deployment (e.g. a VPS or a single long-running Node process). It is
 * NOT shared across serverless function instances — if you deploy to a
 * platform that spins up multiple isolated instances (Vercel, etc.),
 * pair this with an edge/IP-based rate limiter (e.g. Upstash Redis,
 * Vercel Firewall rules) for real protection in production.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Prevent unbounded memory growth if the process runs for a long time.
const MAX_TRACKED_KEYS = 5000;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * @param key unique identifier for the caller, e.g. `login:${ip}`
 * @param limit max requests allowed within the window
 * @param windowMs window size in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      buckets.clear();
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/** Best-effort client identifier from standard proxy headers. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
