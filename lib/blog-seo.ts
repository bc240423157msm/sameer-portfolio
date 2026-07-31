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

export function checkFocusKeyword(
  keyword: string,
  opts: {
    title: string;
    excerpt: string;
    contentHtml: string;
  }
): FocusKeywordCheck | null {
  const kw = normalizeForMatch(keyword).trim();
  if (!kw) return null;

  const title = normalizeForMatch(opts.title);
  const excerpt = normalizeForMatch(opts.excerpt);
  const firstPara = normalizeForMatch(firstParagraphText(opts.contentHtml));
  const h2Matches = opts.contentHtml.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) ?? [];
  const h2Text = normalizeForMatch(h2Matches.map(stripHtml).join(" "));

  return {
    inTitle: title.includes(kw),
    inFirstParagraph: firstPara.includes(kw),
    inH2: h2Text.includes(kw),
    inMetaDescription: excerpt.includes(kw),
  };
}
