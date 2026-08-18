"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EditableText } from "@/components/common/EditableText";
import type { SiteContent } from "@/types/content";

interface WhyWorkProcessClientProps {
  whyWorkWithMe: SiteContent["whyWorkWithMe"];
  developmentProcess: SiteContent["developmentProcess"];
}

export function WhyWorkProcessClient({
  whyWorkWithMe,
  developmentProcess,
}: WhyWorkProcessClientProps) {
  return (
    <>
      <section className="border-y border-border/60 bg-surface/50 py-24">
        <Container>
          <SectionHeading
            eyebrow="Why Work With Me"
            title="Built for businesses that value quality"
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyWorkWithMe.map((item, i) => (
              <div
                key={item.id}
                className="rounded-xl border border-border/60 bg-card/40 p-6"
              >
                <EditableText
                  contentPath={`whyWorkWithMe.${i}.title`}
                  as="h3"
                  className="font-semibold text-text-primary"
                >
                  {item.title}
                </EditableText>
                <EditableText
                  contentPath={`whyWorkWithMe.${i}.description`}
                  as="p"
                  className="mt-2 text-sm leading-relaxed text-text-secondary"
                >
                  {item.description}
                </EditableText>
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
                key={step.id}
                className="flex items-start gap-6 rounded-xl border border-border/60 bg-card/30 p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <EditableText
                    contentPath={`developmentProcess.${i}.step`}
                    as="h3"
                    className="font-semibold text-text-primary"
                  >
                    {step.step}
                  </EditableText>
                  <EditableText
                    contentPath={`developmentProcess.${i}.description`}
                    as="p"
                    className="mt-1 text-sm text-text-secondary"
                  >
                    {step.description}
                  </EditableText>
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
    </>
  );
}
