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
  "Software Engineer",
  "Freelance Software Engineer",
  "Software Engineer for Hire",
  "Remote Software Engineer",
  "Hire a Software Engineer",
  "Software Developer",
];

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Absolute or site-relative OG/Twitter image URL */
  image?: string;
}

function absoluteUrl(path = ""): string {
  if (path.startsWith("http")) return path;
  const baseUrl = siteConfig.url.replace(/\/+$/, "");
  const normalizedPath = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `${baseUrl}${normalizedPath}`;
}

function resolveImageUrl(image?: string): string | undefined {
  return absoluteUrl(image ?? "/opengraph-image");
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  image,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const fullTitle =
    path === "" ? siteConfig.title : `${title} | ${siteConfig.name}`;
  const ogImage = resolveImageUrl(image);

  return {
    title: path === "" ? { absolute: siteConfig.title } : title,
    description,
    keywords: [...new Set([...defaultKeywords, ...keywords])],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      types:
        path === "/blog"
          ? { "application/rss+xml": absoluteUrl("/feed.xml") }
          : undefined,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type,
      locale: "en_US",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
      ...(type === "article" && publishedTime
        ? {
            publishedTime,
            ...(modifiedTime ? { modifiedTime } : {}),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
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
    url: absoluteUrl(),
    jobTitle: "Software Engineer | Full Stack Web Developer & AI Automation Specialist",
    knowsAbout: [
      "Website Design",
      "Website Redesign",
      "WordPress",
      "WhatsApp Bots",
      "AI Chatbots",
      "React",
      "Next.js",
      "Software Engineering",
      "Software Development",
    ],
    sameAs: siteConfig.socialProfiles,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl(),
    description: siteConfig.description,
    inLanguage: "en-US",
    publisher: { "@type": "Person", name: siteConfig.name },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/blog?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${siteConfig.name} - Website Design & AI Automation`,
    url: absoluteUrl(),
    description: siteConfig.description,
    areaServed: "Worldwide",
    serviceType: [
      "Website Design",
      "Website Redesign",
      "WordPress Development",
      "WhatsApp Bot Development",
      "AI Chatbot Development",
      "E-commerce Development",
      "Software Engineering",
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
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedAt?: string;
  image?: string;
}) {
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: absoluteUrl(`/blog/${slug}`),
    datePublished: publishedAt,
    dateModified: modifiedAt ?? publishedAt,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: absoluteUrl(),
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
      url: absoluteUrl(),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${slug}`),
    },
    inLanguage: "en-US",
  };
}

export function webPageJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", url: absoluteUrl(), name: siteConfig.name },
  };
}

export function itemListJsonLd(
  items: { name: string; description: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: item.name,
        description: item.description,
        url: item.url,
      },
    })),
  };
}

export function blogListingJsonLd(
  posts: { title: string; slug: string; excerpt: string; createdAt: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} Blog`,
    url: absoluteUrl("/blog"),
    description: "Web development, SEO, and automation insights.",
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.createdAt,
    })),
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
    url: absoluteUrl(),
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
