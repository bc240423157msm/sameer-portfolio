import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTASectionWrapper } from "@/components/sections/CTASectionWrapper";
import { AboutPageClient } from "@/components/sections/AboutPageClient";
import { getSiteContent } from "@/lib/data";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about Sameer Malik — software engineer specializing in website design, website redesign, WordPress, WhatsApp bot & AI chatbot development for international clients.",
  path: "/about",
  keywords: [
    "Website Design",
    "Website Redesign",
    "WordPress Developer",
    "Software Engineer",
  ],
});

export const revalidate = 3600;

export default async function AboutPage() {
  const content = await getSiteContent();
  const { about } = content;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHero
        variant="about"
        priority
        eyebrow={content.settings.pageHeroText.about.eyebrow}
        title={content.settings.pageHeroText.about.title}
        description={content.settings.pageHeroText.about.description}
      />

      <AboutPageClient about={about} developmentProcess={content.developmentProcess} />
      <CTASectionWrapper />
    </>
  );
}
