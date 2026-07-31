/**
 * Sliding-window rate limiter backed by Upstash Redis when configured,
 * with an in-memory fallback for local development.
 */

import { isDbConfigured } from "@/lib/kv";
import { Redis } from "@upstash/redis";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 5000;

const redis =
  isDbConfigured
    ? new Redis({
        url:
          process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
        token:
          process.env.KV_REST_API_TOKEN ||
          process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
    : null;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

async function rateLimitRedis(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const redisKey = `ratelimit:${key}`;
  const windowSec = Math.ceil(windowMs / 1000);

  const count = await redis!.incr(redisKey);
  if (count === 1) {
    await redis!.expire(redisKey, windowSec);
  }

  const ttl = await redis!.ttl(redisKey);
  const resetAt = now + (ttl > 0 ? ttl * 1000 : windowMs);

  if (count > limit) {
    return { success: false, remaining: 0, resetAt };
  }

  return { success: true, remaining: limit - count, resetAt };
}

function rateLimitMemory(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
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

/** @param key unique identifier, e.g. `login:${ip}` */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  if (redis) {
    try {
      return await rateLimitRedis(key, limit, windowMs);
    } catch (err) {
      console.error("[rate-limit] Redis failed, falling back to memory", err);
    }
  }
  return rateLimitMemory(key, limit, windowMs);
}

/** Best-effort client identifier from standard proxy headers. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/** Hash IP + resource for vote deduplication without storing raw IPs. */
export async function hashVoterKey(
  ip: string,
  resourceId: string
): Promise<string> {
  const secret = process.env.AUTH_SECRET ?? "fallback-dev-secret";
  const data = new TextEncoder().encode(`${secret}:${ip}:${resourceId}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
