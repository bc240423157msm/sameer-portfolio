import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "h2",
  "h3",
  "h4",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "br",
  "img",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "class", "loading"];

/** Returns true when the string looks like HTML rather than plain text. */
export function isHtmlContent(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content.trim());
}

/** Convert legacy plain-text posts (paragraphs separated by blank lines) to HTML. */
export function plainTextToHtml(content: string): string {
  if (!content.trim()) return "";
  if (isHtmlContent(content)) return content;

  return content
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => `<p>${escapeHtml(para)}</p>`)
    .join("");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Sanitize admin-authored HTML before rendering on the public site. */
export function sanitizeBlogHtml(html: string): string {
  const normalized = plainTextToHtml(html);
  return DOMPurify.sanitize(normalized, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ["target"],
  });
}

/** Strip tags and count words for reading-time estimates. */
export function countWordsFromHtml(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}

export function readingTimeMinutes(html: string, wpm = 200): number {
  const words = countWordsFromHtml(html);
  return Math.max(1, Math.ceil(words / wpm));
}

/** Extract plain text from HTML (first paragraph, all text, etc.). */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** First block of text from HTML content. */
export function firstParagraphText(html: string): string {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (match?.[1]) return stripHtml(match[1]);
  return stripHtml(html).slice(0, 300);
}
