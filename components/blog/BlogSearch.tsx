"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Search, Tag } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";
import { readingTimeMinutes } from "@/lib/blog-html";
import type { BlogPost } from "@/types/content";

interface BlogSearchProps {
  posts: BlogPost[];
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category))),
    [posts]
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      const matchesCategory = !activeCategory || post.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [posts, query, activeCategory]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === null
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-text-secondary hover:border-primary/40"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === category
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-text-secondary hover:border-primary/40"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-text-muted">
          No articles match your search.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <TiltCard key={post.id} className="h-full">
            <article
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="relative h-40 w-full overflow-hidden">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                    <span className="text-4xl font-bold text-primary/30">
                      {post.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readingTimeMinutes(post.content)} min
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-text-primary group-hover:text-accent">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-2 flex-1 text-sm text-text-secondary line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
}
