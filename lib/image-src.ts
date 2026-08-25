/** Default site logo served from /public/logo.webp */
export const DEFAULT_LOGO = "/logo.webp";

/**
 * Normalize image URLs so Next.js Image and /public static files resolve correctly.
 * Fixes common issues: empty strings from KV, accidental `/public/` prefix, missing leading slash.
 */
export function resolveImageSrc(
  src: string | undefined | null,
  fallback = DEFAULT_LOGO
): string {
  if (!src || !src.trim()) {
    return fallback;
  }

  const trimmed = src.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  let path = trimmed.replace(/^\/public\//, "/");
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  return path;
}

/** Like resolveImageSrc but returns undefined when the source is empty (optional images). */
export function resolveOptionalImageSrc(
  src: string | undefined | null
): string | undefined {
  if (!src || !src.trim()) return undefined;
  return resolveImageSrc(src);
}

/** True for paths served directly from /public. */
export function isLocalPublicImage(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}
