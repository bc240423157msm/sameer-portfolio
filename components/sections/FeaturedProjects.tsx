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
          {projects.map((project) => (
            <StaggerItem key={project.slug}>
              <FeaturedProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
