import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

/**
 * Single storage abstraction used everywhere instead of raw fs.readFile/writeFile.
 *
 * WHY THIS EXISTS:
 * On Vercel (and most serverless hosts), the filesystem a function writes to is
 * thrown away after the request finishes — and the whole thing resets to the
 * last deployed code on every redeploy. Writing JSON files to disk (the old
 * approach) meant any change made from the admin dashboard could vanish.
 *
 * This file fixes that by storing data in Upstash Redis (a real, persistent
 * database) whenever it's configured. Locally, or if you haven't set up Redis
 * yet, it automatically falls back to writing local JSON files under /data so
 * `npm run dev` keeps working with zero setup.
 *
 * SETUP ON VERCEL:
 * 1. Vercel Dashboard → your project → Storage tab → Create Database → pick
 *    "Upstash" → "Redis". Vercel wires up the env vars for you automatically
 *    (KV_REST_API_URL / KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL / TOKEN).
 * 2. Redeploy. That's it — no code changes needed.
 */

const redisUrl =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

export const isDbConfigured = Boolean(redisUrl && redisToken);

const redis = isDbConfigured && !isProductionBuild
  ? new Redis({ url: redisUrl!, token: redisToken! })
  : null;

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function localPath(key: string) {
  // keys look like "site-content", "auth-store", etc.
  return path.join(DATA_DIR, `${key}.json`);
}

/** Read a JSON value by key. Returns `fallback` if the key doesn't exist yet. */
export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  if (redis) {
    try {
      const value = await redis.get<T>(key);
      return value === null || value === undefined ? fallback : value;
    } catch (err) {
      console.error(`[kv] redis get failed for "${key}"`, err);
      return fallback;
    }
  }

  try {
    const raw = await fs.readFile(localPath(key), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Write a JSON value by key. */
export async function kvSet<T>(key: string, value: T): Promise<void> {
  if (redis) {
    await redis.set(key, value);
    return;
  }

  await ensureDataDir();
  await fs.writeFile(localPath(key), JSON.stringify(value, null, 2), "utf-8");
}

/** Delete a key entirely. */
export async function kvDelete(key: string): Promise<void> {
  if (redis) {
    await redis.del(key);
    return;
  }
  try {
    await fs.unlink(localPath(key));
  } catch {
    // already gone
  }
}

/** Set a value with an expiry (seconds). Used for short-lived things like OTP codes. */
export async function kvSetWithTtl<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  if (redis) {
    await redis.set(key, value, { ex: ttlSeconds });
    return;
  }
  // Local fallback: store with an expiresAt stamp, checked on read.
  await ensureDataDir();
  await fs.writeFile(
    localPath(key),
    JSON.stringify({ __expiresAt: Date.now() + ttlSeconds * 1000, value }),
    "utf-8"
  );
}

export async function kvGetWithTtl<T>(key: string): Promise<T | null> {
  if (redis) {
    const value = await redis.get<T>(key);
    return value ?? null;
  }
  try {
    const raw = await fs.readFile(localPath(key), "utf-8");
    const parsed = JSON.parse(raw) as { __expiresAt: number; value: T };
    if (Date.now() > parsed.__expiresAt) return null;
    return parsed.value;
  } catch {
    return null;
  }
}
