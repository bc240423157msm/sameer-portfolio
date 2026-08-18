"use client";

import { Container } from "@/components/layout/Container";
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedProjectCard } from "@/components/sections/ProjectCards";
import type { SiteContent } from "@/types/content";

interface FeaturedProjectsClientProps {
  projects: SiteContent["portfolio"];
}

export function FeaturedProjectsClient({ projects }: FeaturedProjectsClientProps) {
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
      </Container>
    </section>
  );
}
