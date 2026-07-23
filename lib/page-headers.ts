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
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80&auto=format&fit=crop",
    alt: "Modern technology and digital network — website design hero",
  },
  about: {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80&auto=format&fit=crop",
    alt: "Developer workspace with laptop and clean desk setup",
  },
  services: {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80&auto=format&fit=crop",
    alt: "Business analytics dashboard and web development",
  },
  portfolio: {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80&auto=format&fit=crop",
    alt: "Professional software development environment",
  },
  blog: {
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80&auto=format&fit=crop",
    alt: "Creative writing and content creation on laptop",
  },
  contact: {
    src: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80&auto=format&fit=crop",
    alt: "Professional communication and client contact",
  },
  legal: {
    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80&auto=format&fit=crop",
    alt: "Professional documents and business paperwork",
  },
};

export const defaultBranding = {
  logoSrc: "/logo.webp",
  logoAlt: "Sameer Malik — Website Design & Development",
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
