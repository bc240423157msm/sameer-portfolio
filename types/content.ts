export type UserRole = "admin" | "seo";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  /** Cover image shown on the blog card and post header. Optional — falls back to a styled placeholder. */
  coverImage?: string;
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
}

export interface SiteBranding {
  logoSrc: string;
  logoAlt: string;
}

export interface SiteSettings {
  whatsappNumber: string;
  gaMeasurementId: string;
  contactEmail: string;
  calendlyUrl: string;
  branding: SiteBranding;
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
