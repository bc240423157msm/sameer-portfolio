import type { SiteContent } from "@/types/content";
import {
  aboutCopy,
  caseStudies,
  defaultTestimonials,
  developmentProcess,
  faqCopy,
  servicesCopy,
  whyWorkWithMe,
} from "@/lib/copy";
import { defaultBranding, defaultPageHeaders, defaultPageHeroText } from "@/lib/page-headers";
import { footerLinks, navLinks } from "@/lib/site-config";

// Real project screenshots live in /public. Case studies that don't have a
// dedicated screenshot yet still fall back to a stock Unsplash image below —
// drop the real file into /public and add it here to replace it.
const caseStudyImages: Record<string, string> = {
  furniflair: "/furniflair-screenshot.png",
  "ai-whatsapp-bot": "/whatsapp_bot.webp",
  pascalinesoft: "/pascalinesoft-screenshot.png",
  "pascalinesoft-uk": "/pascalinesoft-screenshot.png",
  "whatsapp-auto-chat": "/whatsappchatbot.webp",
  "ubqari-trust": "/ubqari-screenshot.png",
  pureworkathletics:
    "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=1200&q=80&auto=format&fit=crop",
};

const caseStudyUrls: Record<string, string> = {
  furniflair: "https://furniflair.com",
  pascalinesoft: "https://pascalinesoft.com",
  "pascalinesoft-uk": "https://pascalinesoft.co.uk",
  "ubqari-trust": "https://www.ukekf.org/",
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
    gaMeasurementId: "G-55XP6XQ1D0I",
    seo: {
      googleSiteVerification: "Y4snnMZUcOQAHqt3d7Q5dVBXslq19GFfvl3BZI5tLmk",
      bingSiteVerification: "",
      googleTagManagerId: "",
      pinterestVerification: "",
    },
    contactEmail: "muhammad.sameer@pascalinesoft.com",
    calendlyUrl: "",
    testimonialAutoScrollSeconds: 6,
    branding: defaultBranding,
    navLinks,
    footerLinks,
    footerDescription:
      "Full Stack Web Developer & AI Automation Specialist building fast, SEO-friendly websites and intelligent automation for businesses worldwide.",
    socialLinks: [
      {
        id: "social-github",
        platform: "github",
        label: "GitHub",
        href: "https://github.com/bc240423157msm",
      },
      {
        id: "social-linkedin",
        platform: "linkedin",
        label: "LinkedIn",
        href: "https://linkedin.com/in/sameermalik400",
      },
      {
        id: "social-upwork",
        platform: "upwork",
        label: "Upwork",
        href: "https://upwork.com/freelancers/~sameermalik",
      },
      {
        id: "social-fiverr",
        platform: "fiverr",
        label: "Fiverr",
        href: "https://fiverr.com/sameermalik",
      },
    ],
    pageHeaders: defaultPageHeaders,
    pageHeroText: defaultPageHeroText,
  },
  about: {
    ...aboutCopy,
    detailsImage: {
      src: "/about-details.webp",
      alt: "Sameer Malik — development work in detail",
    },
    galleryPhotos: [
      { id: "gallery-1", src: "/sameermalik2.webp", alt: "Sameer Malik working" },
      { id: "gallery-2", src: "/hover_image_show.webp", alt: "Sameer Malik at his desk" },
      { id: "gallery-3", src: "/sameermalik7.webp", alt: "Sameer Malik — freelance developer" },
      { id: "gallery-4", src: "/sameermalik.webp", alt: "Sameer Malik portrait" },
      { id: "gallery-5", src: "/sameermalik1.webp", alt: "Sameer Malik profile photo" },
      { id: "gallery-6", src: "/sameermalik3.webp", alt: "Sameer Malik portfolio photo" },
      { id: "gallery-7", src: "/sameermalik4.webp", alt: "Sameer Malik professional photo" },
      { id: "gallery-8", src: "/sameermalik6.webp", alt: "Sameer Malik developer photo" },
    ],
  },
  services: servicesCopy,
  whyWorkWithMe: whyWorkWithMe.map((item, i) => ({
    id: `why-work-${i + 1}`,
    ...item,
  })),
  developmentProcess: developmentProcess.map((item, i) => ({
    id: `process-${i + 1}`,
    ...item,
  })),
  contactPage: {
    getInTouch: {
      eyebrow: "Get in Touch",
      title: "Let's build something together",
      description:
        "Tell me about your project and I'll get back to you within 24 hours to discuss the details.",
    },
    responseTime: "Usually responds within 24 hours",
    formTitle: "Send a message",
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
    },
  },
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
    tagline: "Software Engineer | Website Design, WordPress & WhatsApp Bot Developer",
    headline: "Website Design & AI Automation Specialist",
    description:
      "I design fast, modern websites, build custom WordPress solutions, develop WhatsApp bots, and deliver website redesigns that help businesses grow and automate workflows.",
  },
  home: {
    stats: [
      { id: "stat-1", value: 3, suffix: "+", label: "Years Experience" },
      { id: "stat-2", value: 25, suffix: "+", label: "Projects Delivered" },
      { id: "stat-3", value: 15, suffix: "+", label: "Happy Clients" },
      { id: "stat-4", value: 10, suffix: "+", label: "Technologies" },
    ],
    techStack: {
      title: "Technologies I Use",
      description:
        "Modern tools and frameworks I work with to build fast, reliable, and scalable solutions.",
      items: [
        { id: "tech-1", name: "React.js", slug: "react" },
        { id: "tech-2", name: "Next.js", slug: "nextjs" },
        { id: "tech-3", name: "TypeScript", slug: "typescript" },
        { id: "tech-4", name: "Node.js", slug: "nodejs" },
        { id: "tech-5", name: "Tailwind CSS", slug: "tailwind" },
        { id: "tech-6", name: "WordPress", slug: "wordpress" },
        { id: "tech-7", name: "HTML5", slug: "html" },
        { id: "tech-8", name: "CSS3", slug: "css" },
        { id: "tech-9", name: "Figma", slug: "figma" },
        { id: "tech-10", name: "AI Video", slug: "aivideo" },
        { id: "tech-11", name: "Video Editing", slug: "video-editing" },
        { id: "tech-12", name: "Canva", slug: "canva" },
        { id: "tech-13", name: "Graphic Design", slug: "graphic-designer" },
        { id: "tech-14", name: "Git", slug: "git" },
        { id: "tech-15", name: "GitHub", slug: "github" },
      ],
    },
    servicesPreview: {
      eyebrow: "Services",
      title: "Solutions built for your business",
      description:
        "From custom websites to AI automation — I help you ship faster, work smarter, and grow with confidence.",
      items: [
        {
          id: "svc-1",
          title: "Custom Web Development",
          description:
            "Fast, responsive websites and landing pages built with React and Next.js — designed to convert visitors into customers.",
          features: ["React.js", "Next.js", "Responsive Design", "SEO"],
          iconKey: "globe",
          href: "/services",
        },
        {
          id: "svc-2",
          title: "AI Automation",
          description:
            "Intelligent chatbots and WhatsApp bots that handle customer support, workflows, and repetitive tasks around the clock.",
          features: [
            "AI Chatbots",
            "WhatsApp Bots",
            "Workflow Automation",
            "API Integration",
          ],
          iconKey: "bot",
          href: "/services",
        },
        {
          id: "svc-3",
          title: "WordPress & E-commerce",
          description:
            "Professional business websites and WooCommerce stores with custom themes, speed optimization, and ongoing maintenance.",
          features: [
            "Business Websites",
            "WooCommerce",
            "Maintenance",
            "Optimization",
          ],
          iconKey: "shopping-cart",
          href: "/services",
        },
      ],
    },
    whyChooseMe: {
      eyebrow: "Why Choose Me",
      title: "A developer who delivers",
      description:
        "I combine technical skill with clear communication to make every project smooth from start to finish.",
      items: [
        {
          id: "why-1",
          title: "Clean Code",
          description:
            "Well-structured, maintainable code that scales with your business — no shortcuts, no technical debt.",
          iconKey: "code",
        },
        {
          id: "why-2",
          title: "Fast Delivery",
          description:
            "Clear timelines and consistent updates so your project ships on schedule without surprises.",
          iconKey: "zap",
        },
        {
          id: "why-3",
          title: "Responsive Design",
          description:
            "Every site looks and works beautifully on desktop, tablet, and mobile — because your customers use all three.",
          iconKey: "globe",
        },
        {
          id: "why-4",
          title: "Long-Term Support",
          description:
            "I stay available after launch for updates, fixes, and improvements as your needs evolve.",
          iconKey: "message",
        },
      ],
    },
    aboutIntro: {
      eyebrow: "Meet the Developer",
      title: "Hi, I'm Sameer Malik",
      paragraph1:
        "I'm a Full Stack Web Developer and AI Automation Specialist working with clients around the world. What started as curiosity about how websites and apps actually work turned into a genuine passion for building tools that solve real business problems.",
      paragraph2:
        "Today, I help startups, agencies, and small businesses ship faster websites, smarter automation, and better customer experiences — without the headaches that usually come with hiring a developer.",
      highlights: [
        {
          id: "hl-1",
          label: "Full Stack Developer & AI Automation Specialist",
          iconKey: "code",
        },
        {
          id: "hl-2",
          label: "BSCS student, sharpening the fundamentals every day",
          iconKey: "graduation-cap",
        },
        {
          id: "hl-3",
          label: "Remote — working with clients worldwide",
          iconKey: "globe2",
        },
      ],
      mainPhoto: {
        src: "/sameermalik.webp",
        alt: "Sameer Malik — Full Stack Web Developer",
      },
      accentPhoto1: {
        src: "/sameermalik1.webp",
        alt: "Sameer Malik at work",
      },
      accentPhoto2: {
        src: "/sameermalik2.webp",
        alt: "Sameer Malik's development setup",
      },
    },
    cta: {
      title: "Ready for a Website Design or Redesign?",
      description:
        "Whether you need a new business website, a WordPress redesign, a WhatsApp bot, or an AI chatbot — let's discuss your project and build something that drives results.",
    },
  },
};

export const defaultCustomPages: import("@/types/content").CustomPage[] = [];

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
