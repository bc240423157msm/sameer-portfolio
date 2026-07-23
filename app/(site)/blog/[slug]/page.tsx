import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { CommentSection } from "@/components/blog/CommentSection";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/data";
import { articleJsonLd, breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) return { title: "Post Not Found" };

  return createPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: [post.category, "Web Development", "SEO"],
    type: "article",
    publishedTime: post.createdAt,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) notFound();

  return (
    <article>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          articleJsonLd({
            title: post.title,
            description: post.excerpt,
            slug: post.slug,
            publishedAt: post.createdAt,
          }),
        ]}
      />

      <section className="border-b border-border/60 bg-surface/30 py-16">
        <Container>
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <Tag className="h-4 w-4" aria-hidden />
              {post.category}
            </span>
            <time
              dateTime={post.createdAt}
              className="flex items-center gap-1"
            >
              <Calendar className="h-4 w-4" aria-hidden />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold text-text-primary sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-secondary">
            {post.excerpt}
          </p>
        </Container>
      </section>

      {post.coverImage && (
        <div className="relative h-64 w-full sm:h-96">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      )}

      <section className="py-16">
        <Container>
          <div className="max-w-3xl">
            {post.content.split("\n\n").map((paragraph) => (
              <p
                key={paragraph.slice(0, 50)}
                className="mb-6 leading-relaxed text-text-secondary"
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-16 border-t border-border/60 pt-10">
              <CommentSection postSlug={post.slug} />
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
}
