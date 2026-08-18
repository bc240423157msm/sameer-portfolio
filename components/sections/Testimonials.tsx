import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { MotionReveal } from "@/components/common/MotionReveal";
import { TestimonialsGrid } from "@/components/sections/TestimonialsGrid";
import { getSiteContent } from "@/lib/data";
import { getTestimonialLikes } from "@/lib/testimonial-likes";
import { reviewsJsonLd } from "@/lib/seo";

export async function Testimonials() {
  const content = await getSiteContent();
  const { testimonials } = content;

  if (testimonials.length === 0) return null;

  const likes = await getTestimonialLikes();
  const reviewSchema = reviewsJsonLd(testimonials);

  return (
    <section className="border-y border-border/60 py-24">
      {reviewSchema && <JsonLd data={reviewSchema} />}
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="What clients say"
            description="Feedback from businesses I've helped with website design, redesign, WordPress, and WhatsApp automation."
            align="center"
            className="mx-auto"
          />
        </MotionReveal>

        <TestimonialsGrid
          testimonials={testimonials}
          likes={likes}
          autoScrollSeconds={content.settings.testimonialAutoScrollSeconds}
        />

        <div className="mt-10 text-center">
          <Link
            href="/leave-a-review"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-card"
          >
            Worked with me? Leave a review →
          </Link>
        </div>
      </Container>
    </section>
  );
}
