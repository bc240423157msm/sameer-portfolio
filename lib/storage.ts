import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

const DATA_DIR = path.join(process.cwd(), "data");

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

/** True when Upstash Redis is configured — data survives redeploys & server changes. */
export function isPersistentStorageEnabled(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

function filePathForKey(key: string): string {
  return path.join(DATA_DIR, `${key}.json`);
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

/**
 * Reads JSON data. Uses Upstash Redis when configured, otherwise local files.
 * Local files are the fallback for development; Redis is recommended for production.
 */
export async function readStore<T>(key: string, fallback: T): Promise<T> {
  const client = getRedis();
  if (client) {
    try {
      const value = await client.get<T>(`store:${key}`);
      if (value !== null && value !== undefined) return value;
    } catch {
      /* fall through to filesystem */
    }
  }

  try {
    const raw = await fs.readFile(filePathForKey(key), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Writes JSON data to Redis (if configured) and always mirrors to local files. */
export async function writeStore<T>(key: string, data: T): Promise<void> {
  const client = getRedis();
  if (client) {
    await client.set(`store:${key}`, data);
  }

  await ensureDataDir();
  await fs.writeFile(filePathForKey(key), JSON.stringify(data, null, 2), "utf-8");
}
