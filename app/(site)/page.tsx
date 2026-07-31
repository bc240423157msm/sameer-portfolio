import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { Testimonials } from "@/components/sections/Testimonials";
import { StatsSection } from "@/components/sections/StatsSection";
import { CTASectionWrapper } from "@/components/sections/CTASectionWrapper";
import { createPageMetadata } from "@/lib/seo";

const TechStack = dynamic(
  () => import("@/components/sections/TechStack").then((m) => ({ default: m.TechStack }))
);
const ServicesPreview = dynamic(
  () => import("@/components/sections/ServicesPreview").then((m) => ({ default: m.ServicesPreview }))
);
const FeaturedProjects = dynamic(
  () => import("@/components/sections/FeaturedProjects").then((m) => ({ default: m.FeaturedProjects }))
);
const WhyChooseMe = dynamic(
  () => import("@/components/sections/WhyChooseMe").then((m) => ({ default: m.WhyChooseMe }))
);

export const metadata = createPageMetadata({
  title: "Home",
  description:
    "Professional website design, website redesign, WordPress development, WhatsApp bot & AI chatbot development. Sameer Malik builds fast, SEO-friendly websites for businesses worldwide.",
  path: "",
  keywords: [
    "Website Design",
    "Website Redesign",
    "WordPress Website Design",
    "WhatsApp Bot Developer",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <StatsSection />
      <TechStack />
      <ServicesPreview />
      <FeaturedProjects />
      <Testimonials />
      <WhyChooseMe />
      <CTASectionWrapper />
    </>
  );
}
