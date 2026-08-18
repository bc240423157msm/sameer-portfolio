"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { PortfolioImage } from "@/components/sections/PortfolioImage";
import { MotionReveal } from "@/components/common/MotionReveal";
import { EditableText } from "@/components/common/EditableText";
import type { SiteContent } from "@/types/content";

interface PortfolioPageClientProps {
  portfolio: SiteContent["portfolio"];
}

export function PortfolioPageClient({ portfolio }: PortfolioPageClientProps) {
  return (
    <>
      <section className="py-24">
        <Container>
          <div className="space-y-16">
            {portfolio.map((project, index) => (
              <MotionReveal key={project.slug}>
                <article className="overflow-hidden rounded-2xl border border-border/60 bg-card/40">
                  <PortfolioImage
                    project={project}
                    allProjects={portfolio}
                    projectIndex={index}
                  />

                  <div className="grid gap-8 p-8 lg:grid-cols-2 lg:p-10">
                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-wider text-accent">
                        Overview
                      </h3>
                      <EditableText
                        contentPath={`portfolio.${index}.overview`}
                        as="p"
                        className="mt-3 text-text-secondary leading-relaxed"
                      >
                        {project.overview}
                      </EditableText>

                      <h3 className="mt-8 text-sm font-medium uppercase tracking-wider text-accent">
                        The Challenge
                      </h3>
                      <EditableText
                        contentPath={`portfolio.${index}.problem`}
                        as="p"
                        className="mt-3 text-sm text-text-secondary leading-relaxed"
                      >
                        {project.problem}
                      </EditableText>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-wider text-accent">
                        Solution
                      </h3>
                      <EditableText
                        contentPath={`portfolio.${index}.solution`}
                        as="p"
                        className="mt-3 text-sm text-text-secondary leading-relaxed"
                      >
                        {project.solution}
                      </EditableText>

                      <h3 className="mt-8 text-sm font-medium uppercase tracking-wider text-accent">
                        Results
                      </h3>
                      <EditableText
                        contentPath={`portfolio.${index}.results`}
                        as="p"
                        className="mt-3 text-sm text-text-secondary leading-relaxed"
                      >
                        {project.results}
                      </EditableText>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={`${tech}-${techIndex}`}>
                            <EditableText
                              contentPath={`portfolio.${index}.technologies.${techIndex}`}
                              as="span"
                            >
                              {tech}
                            </EditableText>
                          </Badge>
                        ))}
                      </div>

                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-primary"
                        >
                          View Live Project
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-surface/50 py-24">
        <Container>
          <MotionReveal>
            <SectionHeading
              title="Want to see more?"
              description="These are a few highlights from my work. Every project is tailored to the client's specific goals and industry."
              align="center"
              className="mx-auto"
            />
            <div className="mt-10 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
              >
                Start Your Project
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </MotionReveal>
        </Container>
      </section>
    </>
  );
}
