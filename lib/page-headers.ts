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

export const pageHeaderLabels: Record<PageHeaderKey, string> = {
  home: "Home Page",
  about: "About Page",
  services: "Services Page",
  portfolio: "Portfolio Page",
  blog: "Blog Page",
  contact: "Contact Page",
  legal: "Privacy & Terms Pages",
};
