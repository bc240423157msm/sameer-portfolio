import type { NavLink, SiteConfig, SocialLink } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Sameer Malik",
  title:
    "Sameer Malik | Website Design, WordPress & WhatsApp Bot Developer",
  description:
    "Professional website design, website redesign, WordPress development, AI chatbots, and WhatsApp bot development for startups, agencies, and businesses worldwide.",
  url: "https://sameermalik.dev",
  socialProfiles: [
    "https://github.com/sameermalik",
    "https://linkedin.com/in/sameermalik",
    "https://upwork.com/freelancers/~sameermalik",
    "https://fiverr.com/sameermalik",
  ],
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/sameermalik",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/sameermalik",
    external: true,
  },
  {
    label: "Upwork",
    href: "https://upwork.com/freelancers/~sameermalik",
    external: true,
  },
  {
    label: "Fiverr",
    href: "https://fiverr.com/sameermalik",
    external: true,
  },
];
