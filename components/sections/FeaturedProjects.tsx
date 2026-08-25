import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedProjectCard } from "@/components/sections/ProjectCards";
import { getSiteContent } from "@/lib/data";

export async function FeaturedProjects() {
  const content = await getSiteContent();
  const projects = content.portfolio.slice(0, 3);

  if (projects.length === 0) return null;

  return (
    <section className="border-b border-border/60 bg-surface/50 py-24">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="Portfolio"
            title="Featured Projects"
            description="Real work for real businesses — from e-commerce websites to AI-powered automation systems."
          />
        </MotionReveal>

        <StaggerContainer className="mt-16 grid gap-6 md:grid-cols-3">
          {projects.map((project, index) => (
            <StaggerItem key={project.slug}>
              <FeaturedProjectCard project={project} projectIndex={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <MotionReveal className="mt-12 flex justify-center" delay={0.1}>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
          >
            View Full Portfolio
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </MotionReveal>
      </Container>
    </section>
  );
}
