import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/layout/Container";
import { ReviewForm } from "@/components/sections/ReviewForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteContent } from "@/lib/data";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Leave a Review",
  description:
    "Worked with Sameer Malik? Share your experience — your review helps other clients decide.",
  path: "/leave-a-review",
});

export default async function LeaveAReviewPage() {
  const content = await getSiteContent();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Leave a Review", path: "/leave-a-review" },
        ])}
      />
      <PageHero
        variant="contact"
        eyebrow={content.settings.pageHeroText["leave-a-review"].eyebrow}
        title={content.settings.pageHeroText["leave-a-review"].title}
        description={content.settings.pageHeroText["leave-a-review"].description}
      />
      <section className="py-20">
        <Container className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm">
            <ReviewForm />
          </div>
        </Container>
      </section>
    </>
  );
}
