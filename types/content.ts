export type UserRole = "admin" | "seo";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** HTML content from the Tiptap rich-text editor. Legacy plain-text posts are auto-converted on render. */
  content: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  /** Cover image shown on the blog card and post header. Separate from inline body images. */
  coverImage?: string;
  /** Alt text for the cover image — defaults to title if unset. */
  coverImageAlt?: string;
  /** Optional SEO focus keyword for on-page optimization checks in the admin editor. */
  focusKeyword?: string;
}

export interface BlogComment {
  id: string;
  postSlug: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface ContactInfo {
  email: string;
  whatsapp: string;
  location: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  /** Optional client headshot. Falls back to an initial avatar when empty. */
  image?: string;
}

/** A review submitted by a client from the public /leave-a-review page. Sits
 * here until an admin approves it (moves into `testimonials`) or rejects it. */
export interface PendingTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  image?: string;
  createdAt: string;
}

export interface SiteBranding {
  logoSrc: string;
  logoAlt: string;
  /** Logo display width in pixels (admin-controlled). Height scales automatically. */
  logoWidth: number;
}

/** A social/profile link shown in the footer. `platform` selects the icon
 * (see components/common/SocialIcon.tsx); `href` and `label` are fully
 * admin-editable from the dashboard. */
export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  href: string;
}

export interface PageBlock {
  id: string;
  type: "heading" | "paragraph" | "image";
  /** Text content for heading/paragraph blocks. */
  text?: string;
  /** Image URL + alt text for image blocks. */
  imageUrl?: string;
  imageAlt?: string;
}

/** A page created from the admin dashboard without touching any code. */
export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  /** Shown in the browser tab and search results. */
  metaDescription: string;
  blocks: PageBlock[];
  published: boolean;
  /** Show this page in the main nav automatically. */
  showInNav: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  whatsappNumber: string;
  gaMeasurementId: string;
  contactEmail: string;
  calendlyUrl: string;
  branding: SiteBranding;
  socialLinks: SocialLink[];
  pageHeaders: Record<
    "home" | "about" | "services" | "portfolio" | "blog" | "contact" | "legal",
    { src: string; alt: string }
  >;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SiteContent {
  contact: ContactInfo;
  settings: SiteSettings;
  about: {
    personalStory: string;
    experience: string;
    education: string;
    skills: string[];
    whyClientsChooseMe: string[];
  };
  services: {
    id: string;
    title: string;
    shortDescription: string;
    features: string[];
    technologies: string[];
  }[];
  portfolio: {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    technologies: string[];
    overview: string;
    problem: string;
    solution: string;
    results: string;
    projectUrl: string;
    /** Project screenshot. Editable in Admin Dashboard > Portfolio. */
    image: string;
  }[];
  faq: { question: string; answer: string }[];
  testimonials: Testimonial[];
  hero: {
    tagline: string;
    headline: string;
    description: string;
  };
}
