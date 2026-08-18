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
  navLinks: { label: string; href: string }[];
  footerLinks: { label: string; href: string }[];
  footerDescription: string;
  socialLinks: SocialLink[];
  /** Search engine verification codes / SEO integrations, all editable from
   * Admin → Settings → SEO & Search Console so nothing is hardcoded in code. */
  seo: {
    /** Google Search Console: the "content" value of the
     * <meta name="google-site-verification"> tag (not the whole tag). */
    googleSiteVerification: string;
    /** Bing Webmaster Tools verification code. */
    bingSiteVerification: string;
    /** Google Tag Manager container ID, e.g. GTM-XXXXXXX (optional, in
     * addition to the GA4 measurement ID above). */
    googleTagManagerId: string;
    /** Pinterest domain verification code (optional). */
    pinterestVerification: string;
  };
  pageHeaders: Record<
    "home" | "about" | "services" | "portfolio" | "blog" | "contact" | "legal",
    { src: string; alt: string }
  >;
  /** Editable eyebrow/title/description text shown in the banner at the top
   * of each non-home page. Keyed by page (not by the shared header-image
   * variant, since e.g. privacy-policy and terms share an image but need
   * different text). */
  pageHeroText: Record<
    | "about"
    | "services"
    | "portfolio"
    | "blog"
    | "contact"
    | "privacy-policy"
    | "terms"
    | "leave-a-review",
    { eyebrow: string; title: string; description: string }
  >;
  /** Seconds between automatic slides in the homepage testimonials
   * carousel (only 3 reviews show at a time; once there are more than 3
   * it auto-rotates through them). Editable from Admin → Testimonials. */
  testimonialAutoScrollSeconds: number;
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

export interface HomeStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface HomeTechItem {
  id: string;
  name: string;
  slug: string;
  /** Optional custom icon uploaded from the admin dashboard (SVG/PNG/WEBP
   * URL from /api/upload). When set, this overrides the built-in icon set
   * in TechIcon.tsx — used for any technology that doesn't already have a
   * matching slug (e.g. a brand new tool the admin adds). */
  iconUrl?: string;
}

export interface HomeServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  iconKey: string;
  href: string;
}

export interface HomeWhyChooseItem {
  id: string;
  title: string;
  description: string;
  iconKey: string;
}

export interface HomeHighlight {
  id: string;
  label: string;
  iconKey: string;
}

export interface HomePhoto {
  src: string;
  alt: string;
}

export interface HomeContent {
  stats: HomeStat[];
  techStack: {
    title: string;
    description: string;
    items: HomeTechItem[];
  };
  servicesPreview: {
    eyebrow: string;
    title: string;
    description: string;
    items: HomeServiceItem[];
  };
  whyChooseMe: {
    eyebrow: string;
    title: string;
    description: string;
    items: HomeWhyChooseItem[];
  };
  aboutIntro: {
    eyebrow: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    highlights: HomeHighlight[];
    mainPhoto: HomePhoto;
    accentPhoto1: HomePhoto;
    accentPhoto2: HomePhoto;
  };
  cta: {
    title: string;
    description: string;
  };
}

export interface PageHeaderContent {
  src: string;
  alt: string;
  eyebrow?: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
}

export interface ContactPageContent {
  getInTouch: {
    eyebrow: string;
    title: string;
    description: string;
  };
  responseTime: string;
  formTitle: string;
  faq: {
    eyebrow: string;
    title: string;
  };
}

export interface SiteContent {
  contact: ContactInfo;
  settings: SiteSettings;
  home: HomeContent;
  about: {
    personalStory: string;
    experience: string;
    education: string;
    skills: string[];
    whyClientsChooseMe: string[];
    detailsImage: HomePhoto;
    galleryPhotos: GalleryPhoto[];
  };
  services: {
    id: string;
    title: string;
    shortDescription: string;
    features: string[];
    technologies: string[];
    iconKey: string;
  }[];
  /** "Why Work With Me" cards on the Services page. */
  whyWorkWithMe: { id: string; title: string; description: string }[];
  /** "From idea to launch" process steps, shown on both About and Services pages. */
  developmentProcess: { id: string; step: string; description: string }[];
  contactPage: ContactPageContent;
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
