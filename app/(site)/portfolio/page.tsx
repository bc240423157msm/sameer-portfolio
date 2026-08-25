import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { CTASectionWrapper } from "@/components/sections/CTASectionWrapper";
import { PortfolioImage } from "@/components/sections/PortfolioImage";
import {
  MotionReveal,
} from "@/components/common/MotionReveal";
import { getSiteContent } from "@/lib/data";
import { breadcrumbJsonLd, createPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Portfolio",
  description:
    "Portfolio of Sameer Malik — Furniflair furniture website, AI WhatsApp bot, PascalineSoft company site. React, Next.js, WordPress, and automation projects.",
  path: "/portfolio",
  keywords: ["Portfolio Website Developer", "React Developer", "WordPress Developer"],
});

export const revalidate = 3600;

export default async function PortfolioPage() {
  const content = await getSiteContent();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
          ]),
          faqJsonLd(content.faq.slice(0, 6)),
        ]}
      />
      <PageHero
        variant="portfolio"
        eyebrow={content.settings.pageHeroText.portfolio.eyebrow}
        title={content.settings.pageHeroText.portfolio.title}
        description={content.settings.pageHeroText.portfolio.description}
      />

      <section className="py-24">
        <Container>
          <div className="space-y-16">
            {content.portfolio.map((project, index) => (
              <MotionReveal key={project.slug}>
                <article className="overflow-hidden rounded-2xl border border-border/60 bg-card/40">
                  <PortfolioImage
                    project={project}
                    allProjects={content.portfolio}
                    projectIndex={index}
                  />

                  <div className="grid gap-8 p-8 lg:grid-cols-2 lg:p-10">
                    <div>
                      {project.role && (
                        <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-xs font-medium text-text-secondary">
                          {project.role}
                        </p>
                      )}
                      <h3 className="text-sm font-medium uppercase tracking-wider text-accent">
                        Overview
                      </h3>
                      <p className="mt-3 text-text-secondary leading-relaxed">
                        {project.overview}
                      </p>

                      <h3 className="mt-8 text-sm font-medium uppercase tracking-wider text-accent">
                        The Challenge
                      </h3>
                      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                        {project.problem}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-wider text-accent">
                        Solution
                      </h3>
                      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                        {project.solution}
                      </p>

                      <h3 className="mt-8 text-sm font-medium uppercase tracking-wider text-accent">
                        Results
                      </h3>
                      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                        {project.results}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech}>{tech}</Badge>
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

      <CTASectionWrapper />
    </>
  );
}
