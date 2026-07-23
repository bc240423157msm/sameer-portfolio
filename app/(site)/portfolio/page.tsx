import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { CTASectionWrapper } from "@/components/sections/CTASectionWrapper";
import { getSiteContent } from "@/lib/data";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

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
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Portfolio", path: "/portfolio" },
        ])}
      />
      <PageHero
        variant="portfolio"
        eyebrow="Portfolio"
        title="Selected work"
        description="Real projects for real businesses — from luxury e-commerce websites to AI-powered WhatsApp automation systems."
      />

      <section className="py-24">
        <Container>
          <div className="space-y-16">
            {content.portfolio.map((project) => (
              <article
                key={project.slug}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card/40"
              >
                {/* PROJECT IMAGE — edit in Admin Dashboard > Portfolio, or lib/default-content.ts */}
                <div className="relative h-56 w-full sm:h-64">
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.subtitle}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
                  <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
                    <h2 className="text-3xl font-semibold text-text-primary drop-shadow">
                      {project.title}
                    </h2>
                    <p className="mt-2 text-text-secondary drop-shadow">{project.subtitle}</p>
                  </div>
                </div>

                <div className="grid gap-8 p-8 lg:grid-cols-2 lg:p-10">
                  <div>
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
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-surface/30 py-24">
        <Container>
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
        </Container>
      </section>

      <CTASectionWrapper />
    </>
  );
}
