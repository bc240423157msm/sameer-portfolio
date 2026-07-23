import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { CTASectionWrapper } from "@/components/sections/CTASectionWrapper";
import { developmentProcess, whyWorkWithMe } from "@/lib/copy";
import { getSiteContent } from "@/lib/data";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description:
    "Custom web development, AI chatbots, WhatsApp automation, and WordPress & WooCommerce services. React, Next.js, and SEO-friendly websites for startups and businesses.",
  path: "/services",
  keywords: [
    "WooCommerce Developer",
    "AI Chatbot Developer",
    "WhatsApp Bot Developer",
    "Business Website Developer",
  ],
});

export const revalidate = 3600;

export default async function ServicesPage() {
  const content = await getSiteContent();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <PageHero
        variant="services"
        eyebrow="Services"
        title="What I can build for you"
        description="From full websites to automation systems — solutions designed to help your business grow, convert, and operate smarter."
      />

      <section className="py-24">
        <Container>
          <div className="space-y-8">
            {content.services.map((service, index) => (
              <article
                key={service.id}
                className="group rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:p-10"
              >
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <span className="text-sm font-medium text-accent">
                      0{index + 1}
                    </span>
                    <h2 className="mt-2 text-2xl font-semibold text-text-primary">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-text-secondary leading-relaxed">
                      {service.shortDescription}
                    </p>

                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-text-secondary"
                        >
                          <Check className="h-4 w-4 shrink-0 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-surface/50 p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      Technologies
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.technologies.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-surface/30 py-24">
        <Container>
          <SectionHeading
            eyebrow="Why Work With Me"
            title="Built for businesses that value quality"
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyWorkWithMe.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border/60 bg-card/40 p-6"
              >
                <h3 className="font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="From idea to launch"
            description="Every project follows a proven workflow so you always know what to expect."
            align="center"
            className="mx-auto"
          />
          <div className="mt-16 flex flex-col gap-4">
            {developmentProcess.map((step, i) => (
              <div
                key={step.step}
                className="flex items-start gap-6 rounded-xl border border-border/60 bg-card/30 p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {step.step}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Discuss Your Project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <CTASectionWrapper />
    </>
  );
}
