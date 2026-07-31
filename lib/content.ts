import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Code2,
  Globe,
  MessageSquare,
  PenTool,
  Search,
  ShoppingCart,
  TrendingUp,
  Zap,
} from "lucide-react";

export interface Technology {
  name: string;
  slug: string;
}

export interface ServicePreview {
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  href: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const technologies: Technology[] = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextjs" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Node.js", slug: "nodejs" },
  { name: "Tailwind CSS", slug: "tailwind" },
  { name: "WordPress", slug: "wordpress" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Supabase", slug: "supabase" },
  { name: "Git", slug: "git" },
  { name: "GitHub", slug: "github" },
];

export const servicePreviews: ServicePreview[] = [
  {
    title: "Custom Web Development",
    description:
      "Fast, responsive websites and landing pages built with React and Next.js — designed to convert visitors into customers.",
    features: ["React.js", "Next.js", "Responsive Design", "SEO"],
    icon: Globe,
    href: "/services",
  },
  {
    title: "AI Automation",
    description:
      "Intelligent chatbots and WhatsApp bots that handle customer support, workflows, and repetitive tasks around the clock.",
    features: [
      "AI Chatbots",
      "WhatsApp Bots",
      "Workflow Automation",
      "API Integration",
    ],
    icon: Bot,
    href: "/services",
  },
  {
    title: "WordPress & E-commerce",
    description:
      "Professional business websites and WooCommerce stores with custom themes, speed optimization, and ongoing maintenance.",
    features: [
      "Business Websites",
      "WooCommerce",
      "Maintenance",
      "Optimization",
    ],
    icon: ShoppingCart,
    href: "/services",
  },
  {
    title: "Figma & UI/UX Design",
    description:
      "Clean, modern interface design in Figma — wireframes to pixel-perfect mockups — before a single line of code is written.",
    features: ["Wireframing", "Prototyping", "Design Systems", "UI/UX"],
    icon: PenTool,
    href: "/services",
  },
  {
    title: "Social Media Marketing",
    description:
      "Content planning, page management, and paid campaigns that build an audience and turn followers into customers.",
    features: ["Content Strategy", "Page Management", "Paid Ads", "Branding"],
    icon: TrendingUp,
    href: "/services",
  },
  {
    title: "SEO",
    description:
      "On-page and technical SEO that gets sites found on Google — keyword research, speed, structure, and content optimization.",
    features: [
      "Keyword Research",
      "Technical SEO",
      "On-Page SEO",
      "Analytics",
    ],
    icon: Search,
    href: "/services",
  },
];

export const whyChooseItems: WhyChooseItem[] = [
  {
    title: "Clean Code",
    description:
      "Well-structured, maintainable code that scales with your business — no shortcuts, no technical debt.",
    icon: Code2,
  },
  {
    title: "Fast Delivery",
    description:
      "Clear timelines and consistent updates so your project ships on schedule without surprises.",
    icon: Zap,
  },
  {
    title: "Responsive Design",
    description:
      "Every site looks and works beautifully on desktop, tablet, and mobile — because your customers use all three.",
    icon: Globe,
  },
  {
    title: "Long-Term Support",
    description:
      "I stay available after launch for updates, fixes, and improvements as your needs evolve.",
    icon: MessageSquare,
  },
];
