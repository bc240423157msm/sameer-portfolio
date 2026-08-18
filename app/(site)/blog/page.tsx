import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTASectionWrapper } from "@/components/sections/CTASectionWrapper";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { MotionReveal } from "@/components/common/MotionReveal";
import { getPublishedBlogPosts, getSiteContent } from "@/lib/data";
import { breadcrumbJsonLd, blogListingJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Articles on web development, React, Next.js, AI automation, WhatsApp bots, and SEO-friendly website tips for business owners and developers.",
  path: "/blog",
  keywords: ["SEO-Friendly Website", "Web Development Blog"],
});

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const content = await getSiteContent();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          blogListingJsonLd(posts),
        ]}
      />
      <PageHero
        variant="blog"
        eyebrow={content.settings.pageHeroText.blog.eyebrow}
        title={content.settings.pageHeroText.blog.title}
        description={content.settings.pageHeroText.blog.description}
      />

      <section className="py-24">
        <Container>
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-16 text-center">
              <SectionHeading
                title="Articles coming soon"
                description="I'm preparing content on React development, Next.js best practices, AI chatbots, and freelance tips. Check back soon!"
                align="center"
                className="mx-auto"
              />
            </div>
          ) : (
            <>
              <MotionReveal>
                <SectionHeading
                  eyebrow="Latest"
                  title="Recent articles"
                  description="Practical insights for business owners and developers."
                />
              </MotionReveal>
              <div className="mt-12">
                <BlogSearch posts={posts} />
              </div>
            </>
          )}
        </Container>
      </section>

      <CTASectionWrapper />
    </>
  );
}
