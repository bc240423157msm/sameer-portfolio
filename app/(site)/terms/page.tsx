import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { getSiteContent } from "@/lib/data";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Terms of service for project engagements with Sameer Malik — scope, communication, payment, and delivery expectations.",
  path: "/terms",
  keywords: ["Terms of Service"],
});

export default async function TermsPage() {
  const content = await getSiteContent();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ])}
      />
      <PageHero
        variant="legal"
        title={content.settings.pageHeroText.terms.title}
        description={content.settings.pageHeroText.terms.description}
      />

      <section className="py-24">
        <Container>
          <div className="prose prose-invert mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-text-secondary">
            <p>
              These terms outline the general conditions for project
              engagements with Sameer Malik as a freelance web developer
              and automation specialist.
            </p>

            <h2 className="text-lg font-semibold text-text-primary">
              Project Scope
            </h2>
            <p>
              All work is defined by a mutually agreed project scope before
              development begins. Changes outside the agreed scope may
              require additional time and cost, communicated in advance.
            </p>

            <h2 className="text-lg font-semibold text-text-primary">
              Communication
            </h2>
            <p>
              Regular updates are provided throughout the project via email,
              WhatsApp, or your preferred platform. Timely feedback from
              clients helps ensure on-schedule delivery.
            </p>

            <h2 className="text-lg font-semibold text-text-primary">
              Payment
            </h2>
            <p>
              Payment terms are agreed upon before work starts. Typical
              arrangements include milestone-based payments or an upfront
              deposit with balance due on completion.
            </p>

            <h2 className="text-lg font-semibold text-text-primary">
              Intellectual Property
            </h2>
            <p>
              Upon full payment, clients receive ownership of the custom work
              created for their project. Third-party libraries, themes, and
              tools remain under their respective licenses.
            </p>

            <h2 className="text-lg font-semibold text-text-primary">
              Contact
            </h2>
            <p>
              Questions about these terms? Visit the{" "}
              <a href="/contact" className="text-accent hover:underline">
                contact page
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
