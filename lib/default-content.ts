import type { SiteContent } from "@/types/content";
import {
  aboutCopy,
  caseStudies,
  defaultTestimonials,
  faqCopy,
  servicesCopy,
} from "@/lib/copy";
import { defaultBranding, defaultPageHeaders } from "@/lib/page-headers";

// PLACEHOLDER IMAGES — replace each URL with a real project screenshot.
// To use your own file: put it in /public/images/projects/<name>.jpg and
// change the matching line below to e.g. "/images/projects/furniflair.jpg".
const caseStudyImages: Record<string, string> = {
  furniflair:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80&auto=format&fit=crop",
  "ai-whatsapp-bot":
    "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1200&q=80&auto=format&fit=crop",
  pascalinesoft:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
  "pascalinesoft-uk":
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80&auto=format&fit=crop",
  "whatsapp-auto-chat":
    "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1200&q=80&auto=format&fit=crop",
  "ubqari-trust":
    "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1200&q=80&auto=format&fit=crop",
  pureworkathletics:
    "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=1200&q=80&auto=format&fit=crop",
};

const caseStudyUrls: Record<string, string> = {
  furniflair: "https://furniflair.com",
  pascalinesoft: "https://pascalinesoft.com",
  "pascalinesoft-uk": "https://pascalinesoft.co.uk",
  "ubqari-trust": "https://ubqaritrust.pascalinesoft.com",
  pureworkathletics: "https://pureworkathletics.com",
};

export const defaultSiteContent: SiteContent = {
  contact: {
    email: "muhammad.sameer@pascalinesoft.com",
    whatsapp: "+92 323 8867440",
    location: "Remote — Worldwide",
  },
  settings: {
    whatsappNumber: "923238867440",
    gaMeasurementId: "",
    contactEmail: "muhammad.sameer@pascalinesoft.com",
    calendlyUrl: "",
    branding: defaultBranding,
    pageHeaders: defaultPageHeaders,
  },
  about: aboutCopy,
  services: servicesCopy,
  portfolio: caseStudies.map((cs) => ({
    slug: cs.slug,
    title: cs.title,
    subtitle: cs.overview.split(".")[0] ?? cs.title,
    description: cs.overview,
    technologies:
      cs.technologies.length > 0 ? cs.technologies : ["React", "Next.js"],
    overview: cs.overview,
    problem: cs.problem,
    solution: cs.solution,
    results: cs.results,
    projectUrl: caseStudyUrls[cs.slug] ?? "",
    image:
      caseStudyImages[cs.slug] ??
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop",
  })),
  faq: faqCopy,
  testimonials: defaultTestimonials,
  hero: {
    tagline: "Website Design, WordPress & WhatsApp Bot Developer",
    headline: "Website Design & AI Automation Specialist",
    description:
      "I design fast, modern websites, build custom WordPress solutions, develop WhatsApp bots, and deliver website redesigns that help businesses grow and automate workflows.",
  },
};

export const defaultBlogPosts = [
  {
    id: "post-1",
    slug: "why-your-business-needs-a-fast-modern-website",
    title: "Why Your Business Needs a Fast, Modern Website in 2026",
    excerpt:
      "Slow, outdated websites quietly cost businesses customers every day. Here's what actually moves the needle for speed and first impressions.",
    content:
      "A website is often the first interaction a potential customer has with your business — and first impressions form in seconds.\n\nSpeed is not a nice-to-have. Every extra second of load time increases the chance a visitor leaves before they even see what you offer. Modern frameworks like Next.js make it possible to build sites that feel instant, even on mobile networks.\n\nDesign matters just as much as speed. A clean, modern layout signals credibility, while a cluttered or dated one quietly erodes trust before a visitor reads a single word of copy.\n\nFinally, a fast site is also a more discoverable one — search engines factor speed and mobile-friendliness directly into rankings. Investing in performance is really an investment in visibility.",
    category: "Web Development",
    published: true,
    createdAt: "2026-05-12T09:00:00.000Z",
    updatedAt: "2026-05-12T09:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "post-2",
    slug: "whatsapp-bots-for-customer-support",
    title: "How WhatsApp Bots Are Changing Customer Support",
    excerpt:
      "Instant replies, 24/7 availability, and lower support costs — here's how businesses are using WhatsApp automation to keep customers happy.",
    content:
      "Customers expect answers fast, and WhatsApp has become the channel where they expect it most. A well-built bot can greet a new message instantly, answer common questions, and hand off to a human only when it truly matters.\n\nThe biggest win is availability. A bot doesn't sleep, take weekends off, or get overwhelmed during a sale — it responds to the first message and the thousandth exactly the same way.\n\nThe key to a good WhatsApp bot isn't just automation, it's tone. Replies need to feel helpful and human, not robotic, or customers disengage quickly.\n\nDone well, WhatsApp automation turns a support channel into a growth channel — capturing leads and answering questions around the clock.",
    category: "AI Automation",
    published: true,
    createdAt: "2026-04-02T09:00:00.000Z",
    updatedAt: "2026-04-02T09:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "post-3",
    slug: "seo-basics-every-small-business-should-know",
    title: "SEO Basics Every Small Business Should Know",
    excerpt:
      "You don't need to be an SEO expert to rank better on Google. These fundamentals cover most of what actually matters.",
    content:
      "SEO can feel overwhelming, but most of the impact comes from a handful of fundamentals done consistently well.\n\nStart with page speed and mobile-friendliness — both are ranking factors and both directly affect whether visitors stay or leave. Next, make sure every page has a clear, unique title and description that matches what people are actually searching for.\n\nContent still matters more than tricks. Pages that genuinely answer a visitor's question tend to outperform pages stuffed with keywords but light on substance.\n\nFinally, don't ignore the technical basics: a sitemap, clean URLs, and proper headings help search engines understand your site structure — and understanding leads to ranking.",
    category: "SEO",
    published: true,
    createdAt: "2026-03-10T09:00:00.000Z",
    updatedAt: "2026-03-10T09:00:00.000Z",
    coverImage:
      "https://images.unsplash.com/photo-1571677246347-5040036b95cc?w=1200&q=80&auto=format&fit=crop",
  },
];
