import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Container } from "@/components/layout/Container";
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/common/TiltCard";
import { getPublishedBlogPosts } from "@/lib/data";
import { readingTimeMinutes } from "@/lib/blog-html";

/**
 * Homepage "latest articles" teaser — always shows only the 3 most recent
 * published posts (getPublishedBlogPosts is already sorted newest-first),
 * with a button below to see the full blog. Automatically appears the
 * moment a new post is published; automatically stays capped at 3 no
 * matter how many posts exist.
 */
export async function LatestBlogPreview() {
  const posts = await getPublishedBlogPosts();
  const latest = posts.slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <section className="border-b border-border/60 py-24">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="From the blog"
            title="Latest articles"
            description="Fresh thoughts on web development, AI automation, and building better websites."
            align="center"
            className="mx-auto"
          />
        </MotionReveal>

        <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <StaggerItem key={post.id}>
              <TiltCard className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                        <span className="text-4xl font-bold text-primary/30">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
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

                    <h3 className="mt-3 text-lg font-semibold text-text-primary transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-3">
                      {post.excerpt}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                      Read More
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <MotionReveal className="mt-12 flex justify-center" delay={0.1}>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
          >
            View All Blogs
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </MotionReveal>
      </Container>
    </section>
  );
}
