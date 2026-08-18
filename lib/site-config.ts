import type { NavLink, SiteConfig, SocialLink } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Sameer Malik",
  title:
    "Sameer Malik | Software Engineer & Website Design, WordPress, WhatsApp Bot Developer",
  description:
    "Sameer Malik is a software engineer offering professional website design, website redesign, WordPress development, AI chatbots, and WhatsApp bot development for startups, agencies, and businesses worldwide.",
  url: "https://sameermalik.dev",
  bookingUrl: "https://calendly.com/sameer03238867440/30min",
  socialProfiles: [
    "https://github.com/bc240423157msm",
    "https://linkedin.com/in/sameermalik400",
    "https://www.upwork.com/freelancers/~0185021876ca3ab5af",
    "https://www.fiverr.com/sellers/msameermalik786/",
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
  { label: "Leave a Review", href: "/leave-a-review" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/bc240423157msm",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/sameermalik400",
    external: true,
  },
  {
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~0185021876ca3ab5af",
    external: true,
  },
  {
    label: "Fiverr",
    href: "https://www.fiverr.com/sellers/msameermalik786/",
    external: true,
  },
  {
    label: "Book a Call",
    href: "https://calendly.com/sameer03238867440/30min",
    external: true,
  },
];
