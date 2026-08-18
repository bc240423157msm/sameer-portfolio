"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechIcon } from "@/components/ui/TechIcon";
import { EditableText } from "@/components/common/EditableText";
import type { SiteContent } from "@/types/content";

interface TechStackClientProps {
  techStack: SiteContent["home"]["techStack"];
}

export function TechStackClient({ techStack }: TechStackClientProps) {
  return (
    <section className="border-b border-border/60 bg-surface/50 py-24">
      <Container>
        <MotionReveal>
          <SectionHeading
            title={techStack.title}
            description={techStack.description}
            align="center"
            className="mx-auto"
            contentPathPrefix="home.techStack"
          />
        </MotionReveal>

        <StaggerContainer className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {techStack.items.map((tech, index) => (
            <StaggerItem key={tech.id}>
              <motion.div
                className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-card/80"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <TechIcon
                  slug={tech.slug}
                  iconUrl={tech.iconUrl}
                  className="h-9 w-9 transition-transform duration-200 group-hover:scale-110"
                />
                <EditableText
                  contentPath={`home.techStack.items.${index}.name`}
                  as="span"
                  className="text-center text-sm font-medium text-text-secondary transition-colors group-hover:text-text-primary"
                >
                  {tech.name}
                </EditableText>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
