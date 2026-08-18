import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { getSiteContent } from "@/lib/data";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for Sameer Malik portfolio website. How contact form data and visitor information is collected, used, and protected.",
  path: "/privacy-policy",
  keywords: ["Privacy Policy"],
});

export default async function PrivacyPolicyPage() {
  const content = await getSiteContent();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />
      <PageHero
        variant="legal"
        title={content.settings.pageHeroText["privacy-policy"].title}
        description={content.settings.pageHeroText["privacy-policy"].description}
      />

      <section className="py-24">
        <Container>
          <div className="prose prose-invert mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-text-secondary">
            <p>
              This privacy policy explains how {`Sameer Malik's`} portfolio
              website handles information when you visit or contact through
              this site.
            </p>

            <h2 className="text-lg font-semibold text-text-primary">
              Information We Collect
            </h2>
            <p>
              When you use the contact form, we collect your name, email
              address, subject, and message content. We may also collect
              standard technical data such as browser type and pages visited
              through analytics tools.
            </p>

            <h2 className="text-lg font-semibold text-text-primary">
              How We Use Your Information
            </h2>
            <p>
              Contact form submissions are used solely to respond to your
              inquiry and discuss potential projects. We do not sell or share
              your personal information with third parties for marketing
              purposes.
            </p>

            <h2 className="text-lg font-semibold text-text-primary">
              Data Security
            </h2>
            <p>
              We take reasonable measures to protect your information.
              However, no method of transmission over the internet is 100%
              secure.
            </p>

            <h2 className="text-lg font-semibold text-text-primary">
              Contact
            </h2>
            <p>
              For privacy-related questions, please reach out via the{" "}
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
