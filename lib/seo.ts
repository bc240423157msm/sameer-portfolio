import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

const defaultKeywords = [
  "Website Design",
  "Website Redesign",
  "WordPress Developer",
  "WordPress Website Design",
  "WhatsApp Bot Developer",
  "WhatsApp Automation",
  "AI Chatbot Developer",
  "Custom Web Development",
  "Business Website Design",
  "Landing Page Design",
  "E-commerce Website Design",
  "SEO-Friendly Website",
  "React Developer",
  "Next.js Developer",
  "Full Stack Developer",
  "Freelance Web Developer",
  "Remote Web Developer",
  "Website Maintenance",
  "WooCommerce Developer",
];

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  type = "website",
  publishedTime,
}: PageMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle =
    path === "" ? siteConfig.title : `${title} | ${siteConfig.name}`;

  return {
    title: path === "" ? { absolute: siteConfig.title } : title,
    description,
    keywords: [...new Set([...defaultKeywords, ...keywords])],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type,
      locale: "en_US",
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: `@${siteConfig.name.replace(/\s/g, "")}`,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "Full Stack Web Developer & AI Automation Specialist",
    knowsAbout: [
      "Website Design",
      "Website Redesign",
      "WordPress",
      "WhatsApp Bots",
      "AI Chatbots",
      "React",
      "Next.js",
    ],
    sameAs: siteConfig.socialProfiles,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-US",
    publisher: { "@type": "Person", name: siteConfig.name },
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${siteConfig.name} — Website Design & AI Automation`,
    url: siteConfig.url,
    description: siteConfig.description,
    areaServed: "Worldwide",
    serviceType: [
      "Website Design",
      "Website Redesign",
      "WordPress Development",
      "WhatsApp Bot Development",
      "AI Chatbot Development",
      "E-commerce Development",
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function articleJsonLd({
  title,
  description,
  slug,
  publishedAt,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: `${siteConfig.url}/blog/${slug}`,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: { "@type": "Person", name: siteConfig.name },
    inLanguage: "en-US",
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function reviewsJsonLd(
  testimonials: { quote: string; author: string; rating: number }[]
) {
  if (testimonials.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    review: testimonials.map((t) => ({
      "@type": "Review",
      reviewBody: t.quote,
      author: { "@type": "Person", name: t.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
      },
    })),
  };
}
