import { Star } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteContent } from "@/lib/data";
import { reviewsJsonLd } from "@/lib/seo";

export async function Testimonials() {
  const content = await getSiteContent();
  const { testimonials } = content;

  if (testimonials.length === 0) return null;

  const reviewSchema = reviewsJsonLd(testimonials);

  return (
    <section className="border-y border-border/60 bg-surface/30 py-24">
      {reviewSchema && <JsonLd data={reviewSchema} />}
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What clients say"
          description="Feedback from businesses I've helped with website design, redesign, WordPress, and WhatsApp automation."
          align="center"
          className="mx-auto"
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote
              key={item.id}
              className="flex flex-col rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm"
            >
              <div className="mb-4 flex gap-1" aria-label={`${item.rating} out of 5 stars`}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                    aria-hidden
                  />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-text-secondary">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-border/40 pt-4">
                <cite className="not-italic">
                  <p className="text-sm font-medium text-text-primary">
                    {item.author}
                  </p>
                  <p className="text-xs text-text-muted">{item.role}</p>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
