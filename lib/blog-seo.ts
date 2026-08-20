import { firstParagraphText, stripHtml } from "@/lib/blog-html";

export interface MetaDescriptionStatus {
  length: number;
  status: "short" | "ideal" | "long";
}

export function metaDescriptionStatus(excerpt: string): MetaDescriptionStatus {
  const length = excerpt.trim().length;
  if (length < 120) return { length, status: "short" };
  if (length <= 160) return { length, status: "ideal" };
  return { length, status: "long" };
}

export interface FocusKeywordCheck {
  inTitle: boolean;
  inFirstParagraph: boolean;
  inH2: boolean;
  inMetaDescription: boolean;
}

function normalizeForMatch(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Checks focus keyword placement. `keywords` may contain multiple tags —
 * a check passes if ANY of the keywords is found in that location, since
 * a post is well-optimized as long as at least one of its target keywords
 * appears in each key spot.
 */
export function checkFocusKeyword(
  keywords: string[],
  opts: {
    title: string;
    excerpt: string;
    contentHtml: string;
  }
): FocusKeywordCheck | null {
  const kws = keywords.map((k) => normalizeForMatch(k)).filter(Boolean);
  if (kws.length === 0) return null;

  const title = normalizeForMatch(opts.title);
  const excerpt = normalizeForMatch(opts.excerpt);
  const firstPara = normalizeForMatch(firstParagraphText(opts.contentHtml));
  const h2Matches = opts.contentHtml.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) ?? [];
  const h2Text = normalizeForMatch(h2Matches.map(stripHtml).join(" "));

  const anyIn = (haystack: string) => kws.some((kw) => haystack.includes(kw));

  return {
    inTitle: anyIn(title),
    inFirstParagraph: anyIn(firstPara),
    inH2: anyIn(h2Text),
    inMetaDescription: anyIn(excerpt),
  };
}

/** Splits the stored comma-separated focusKeyword string into a clean tag list. */
export function parseKeywordTags(focusKeyword: string | undefined): string[] {
  if (!focusKeyword) return [];
  return focusKeyword
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

/** Joins a tag list back into the comma-separated string used for storage. */
export function stringifyKeywordTags(tags: string[]): string {
  return tags.join(", ");
}
