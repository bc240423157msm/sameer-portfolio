import type { SiteContent } from "@/types/content";

type ContentPath = string;

/** Set a nested value in an object using a dot-path like "hero.title" or "portfolio.0.image". */
export function setByPath(
  obj: Record<string, unknown>,
  path: ContentPath,
  value: unknown
): void {
  const parts = path.split(".");
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    const nextKey = parts[i + 1]!;
    const isIndex = /^\d+$/.test(nextKey);

    if (current[key] === undefined) {
      current[key] = isIndex ? [] : {};
    }
    current = current[key] as Record<string, unknown>;
  }

  const lastKey = parts[parts.length - 1]!;
  if (Array.isArray(current) && /^\d+$/.test(lastKey)) {
    current[Number(lastKey)] = value;
  } else {
    current[lastKey] = value;
  }
}

/** Get a nested value using a dot-path. */
export function getByPath(obj: unknown, path: ContentPath): unknown {
  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    if (Array.isArray(current) && /^\d+$/.test(part)) {
      current = current[Number(part)];
    } else {
      current = (current as Record<string, unknown>)[part];
    }
  }

  return current;
}

/** Validate that a path exists in SiteContent shape. */
export function isValidContentPath(path: string): boolean {
  if (!path || path.includes("..")) return false;
  const allowedPrefixes = [
    "hero",
    "about",
    "contact",
    "settings",
    "services",
    "portfolio",
    "faq",
    "testimonials",
  ];
  const root = path.split(".")[0];
  return allowedPrefixes.includes(root!);
}

export type { ContentPath, SiteContent };
