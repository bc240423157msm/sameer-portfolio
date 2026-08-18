export type PageHeaderKey =
  | "home"
  | "about"
  | "services"
  | "portfolio"
  | "blog"
  | "contact"
  | "legal";

export interface HeaderImage {
  src: string;
  alt: string;
}

/** Default professional header backgrounds — override via admin or site-content.json */
export const defaultPageHeaders: Record<PageHeaderKey, HeaderImage> = {
  home: {
    src: "/Home_Background.webp",
    alt: "Sameer Malik — website design and development",
  },
  about: {
    src: "/about-herosection.webp",
    alt: "Sameer Malik — developer workspace",
  },
  services: {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80&auto=format&fit=crop",
    alt: "Business analytics dashboard and web development",
  },
  portfolio: {
    src: "/work.webp",
    alt: "Sameer Malik — portfolio and project work",
  },
  blog: {
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80&auto=format&fit=crop",
    alt: "Creative writing and content creation on laptop",
  },
  contact: {
    src: "/contact-background.webp",
    alt: "Contact Sameer Malik",
  },
  legal: {
    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80&auto=format&fit=crop",
    alt: "Professional documents and business paperwork",
  },
};

export const defaultBranding = {
  logoSrc: "/logo.webp",
  logoAlt: "Sameer Malik — Website Design & Development",
  /** Logo width in pixels, admin-controlled. Height scales automatically. */
  logoWidth: 104,
};

export const defaultPageHeroText: Record<
  PageHeroTextKey,
  { eyebrow: string; title: string; description: string }
> = {
  about: {
    eyebrow: "About Me",
    title: "The developer behind the code",
    description:
      "A closer look at my background, experience, and the approach I bring to every project.",
  },
  services: {
    eyebrow: "Services",
    title: "What I can build for you",
    description:
      "From full websites to automation systems — solutions designed to help your business grow, convert, and operate smarter.",
  },
  portfolio: {
    eyebrow: "Portfolio",
    title: "Selected work",
    description:
      "Real projects for real businesses — from luxury e-commerce websites to AI-powered WhatsApp automation systems.",
  },
  blog: {
    eyebrow: "Blog",
    title: "Notes on development & automation",
    description:
      "Insights on web development, SEO-friendly websites, AI automation, and working with international clients.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's build something together",
    description:
      "Tell me about your project and I'll get back to you within 24 hours to discuss the details.",
  },
  "privacy-policy": {
    eyebrow: "",
    title: "Privacy Policy",
    description:
      "How information submitted through this website is collected, used, and protected.",
  },
  terms: {
    eyebrow: "",
    title: "Terms of Service",
    description:
      "The terms that apply when working with me on a web development or automation project.",
  },
  "leave-a-review": {
    eyebrow: "Reviews",
    title: "Share your experience",
    description:
      "Worked together on a project? A quick review helps other clients know what to expect.",
  },
};

export const pageHeaderLabels: Record<PageHeaderKey, string> = {
  home: "Home Page",
  about: "About Page",
  services: "Services Page",
  portfolio: "Portfolio Page",
  blog: "Blog Page",
  contact: "Contact Page",
  legal: "Privacy & Terms Pages",
};

export type PageHeroTextKey =
  | "about"
  | "services"
  | "portfolio"
  | "blog"
  | "contact"
  | "privacy-policy"
  | "terms"
  | "leave-a-review";

export const pageHeroTextLabels: Record<PageHeroTextKey, string> = {
  about: "About Page",
  services: "Services Page",
  portfolio: "Portfolio Page",
  blog: "Blog Page",
  contact: "Contact Page",
  "privacy-policy": "Privacy Policy Page",
  terms: "Terms of Service Page",
  "leave-a-review": "Leave a Review Page",
};
