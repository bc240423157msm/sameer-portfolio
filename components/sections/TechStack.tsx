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
import { technologies } from "@/lib/content";

export function TechStack() {
  return (
    <section className="border-b border-border/60 bg-surface/50 py-24">
      <Container>
        <MotionReveal>
          <SectionHeading
            title="Technologies I Use"
            description="Modern tools and frameworks I work with to build fast, reliable, and scalable solutions."
            align="center"
            className="mx-auto"
          />
        </MotionReveal>

        <StaggerContainer className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {technologies.map((tech) => (
            <StaggerItem key={tech.slug}>
              <motion.div
                className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-card/80"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <TechIcon
                  slug={tech.slug}
                  className="h-9 w-9 transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-center text-sm font-medium text-text-secondary transition-colors group-hover:text-text-primary">
                  {tech.name}
                </span>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
