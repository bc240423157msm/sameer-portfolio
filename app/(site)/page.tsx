import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { AboutIntroWrapper } from "@/components/sections/AboutIntroWrapper";
import { Testimonials } from "@/components/sections/Testimonials";
import { StatsSectionWrapper } from "@/components/sections/StatsSectionWrapper";
import { CTASectionWrapper } from "@/components/sections/CTASectionWrapper";
import { createPageMetadata } from "@/lib/seo";

const TechStackWrapper = dynamic(() =>
  import("@/components/sections/TechStackWrapper").then((m) => ({
    default: m.TechStackWrapper,
  }))
);
const ServicesPreviewWrapper = dynamic(() =>
  import("@/components/sections/ServicesPreviewWrapper").then((m) => ({
    default: m.ServicesPreviewWrapper,
  }))
);
const FeaturedProjects = dynamic(
  () => import("@/components/sections/FeaturedProjects").then((m) => ({ default: m.FeaturedProjects }))
);
const LatestBlogPreview = dynamic(() =>
  import("@/components/sections/LatestBlogPreview").then((m) => ({
    default: m.LatestBlogPreview,
  }))
);
const WhyChooseMeWrapper = dynamic(() =>
  import("@/components/sections/WhyChooseMeWrapper").then((m) => ({
    default: m.WhyChooseMeWrapper,
  }))
);

export const metadata = createPageMetadata({
  title: "Home",
  description:
    "Professional website design, website redesign, WordPress development, WhatsApp bot & AI chatbot development. Sameer Malik is a software engineer building fast, SEO-friendly websites for businesses worldwide.",
  path: "",
  keywords: [
    "Website Design",
    "Website Redesign",
    "WordPress Website Design",
    "WhatsApp Bot Developer",
    "Software Engineer",
    "Freelance Software Engineer",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutIntroWrapper />
      <StatsSectionWrapper />
      <TechStackWrapper />
      <ServicesPreviewWrapper />
      <FeaturedProjects />
      <LatestBlogPreview />
      <Testimonials />
      <WhyChooseMeWrapper />
      <CTASectionWrapper />
    </>
  );
}
