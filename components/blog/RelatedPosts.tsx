import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/content";
import { readingTimeMinutes } from "@/lib/blog-html";

interface RelatedPostsProps {
  posts: BlogPost[];
  currentSlug: string;
}

export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const related = posts
    .filter((p) => p.slug !== currentSlug && p.published)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <aside className="mt-16 border-t border-border/60 pt-10">
      <h2 className="text-xl font-semibold text-text-primary">Related articles</h2>
      <p className="mt-1 text-sm text-text-muted">
        More insights on web development and SEO
      </p>
      <ul className="mt-6 space-y-4">
        {related.map((post) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-card/30 p-4 transition-colors hover:border-primary/30"
            >
              <div>
                <p className="font-medium text-text-primary group-hover:text-primary">
                  {post.title}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                  {post.excerpt}
                </p>
                <p className="mt-2 text-xs text-text-muted">
                  {post.category} · {readingTimeMinutes(post.content)} min read
                </p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-accent" />
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/services"
        className="mt-6 inline-flex text-sm font-medium text-accent hover:text-primary"
      >
        Explore my services →
      </Link>
    </aside>
  );
}
