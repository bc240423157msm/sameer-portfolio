import { sanitizeBlogHtml } from "@/lib/blog-html";

interface BlogContentProps {
  content: string;
  className?: string;
}

/**
 * Renders sanitized blog post HTML with site-matched prose styling.
 * Falls back gracefully for legacy plain-text posts.
 */
export function BlogContent({ content, className }: BlogContentProps) {
  const html = sanitizeBlogHtml(content);

  return (
    <div
      className={className ?? "blog-prose"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
