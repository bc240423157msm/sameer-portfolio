import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/layout/Container";
import { ReviewForm } from "@/components/sections/ReviewForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Leave a Review",
  description:
    "Worked with Sameer Malik? Share your experience — your review helps other clients decide.",
  path: "/leave-a-review",
});

export default function LeaveAReviewPage() {
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
        eyebrow="Reviews"
        title="Share your experience"
        description="Worked together on a project? A quick review helps other clients know what to expect."
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
