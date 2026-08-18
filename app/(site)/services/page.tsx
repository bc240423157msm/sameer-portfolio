import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTASectionWrapper } from "@/components/sections/CTASectionWrapper";
import { ServicesPageClient } from "@/components/sections/ServicesPageClient";
import { WhyWorkProcessClient } from "@/components/sections/WhyWorkProcessClient";
import { getSiteContent } from "@/lib/data";
import { breadcrumbJsonLd, createPageMetadata, faqJsonLd, itemListJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description:
    "Custom web development, AI chatbots, WhatsApp automation, and WordPress & WooCommerce services. React, Next.js, and SEO-friendly websites for startups and businesses.",
  path: "/services",
  keywords: [
    "WooCommerce Developer",
    "AI Chatbot Developer",
    "WhatsApp Bot Developer",
    "Business Website Developer",
    "Software Engineer",
    "Software Engineering Services",
  ],
});

export const revalidate = 3600;

export default async function ServicesPage() {
  const content = await getSiteContent();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          itemListJsonLd(
            content.services.map((s) => ({
              name: s.title,
              description: s.shortDescription,
              url: `${siteConfig.url}/services#${s.id}`,
            }))
          ),
          faqJsonLd(content.faq.slice(0, 6)),
        ]}
      />
      <PageHero
        variant="services"
        eyebrow={content.settings.pageHeroText.services.eyebrow}
        title={content.settings.pageHeroText.services.title}
        description={content.settings.pageHeroText.services.description}
      />

      <ServicesPageClient services={content.services} />

      <WhyWorkProcessClient
        whyWorkWithMe={content.whyWorkWithMe}
        developmentProcess={content.developmentProcess}
      />

      <CTASectionWrapper />
    </>
  );
}
