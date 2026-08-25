"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { EditableText } from "@/components/common/EditableText";
import { EditableImage } from "@/components/common/EditableImage";
import { EditableIcon } from "@/components/common/EditableIcon";
import type { SiteContent } from "@/types/content";

interface AboutIntroClientProps {
  aboutIntro: SiteContent["home"]["aboutIntro"];
}

export function AboutIntroClient({ aboutIntro }: AboutIntroClientProps) {
  return (
    <section className="border-b border-border/60 bg-surface/50 py-24">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <MotionReveal
            direction="right"
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border/60 bg-card/40">
              <EditableImage
                contentPath="home.aboutIntro.mainPhoto.src"
                src={aboutIntro.mainPhoto.src}
                alt={aboutIntro.mainPhoto.alt}
                sizes="(max-width: 1024px) 80vw, 40vw"
                fallbackSrc="/sameermalik.webp"
              />
            </div>

            <div className="absolute -bottom-8 -left-6 hidden h-28 w-28 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:block">
              <EditableImage
                contentPath="home.aboutIntro.accentPhoto1.src"
                src={aboutIntro.accentPhoto1.src}
                alt={aboutIntro.accentPhoto1.alt}
                sizes="112px"
                fallbackSrc="/sameermalik1.webp"
              />
            </div>

            <div className="absolute -right-6 -top-6 hidden h-24 w-24 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:block">
              <EditableImage
                contentPath="home.aboutIntro.accentPhoto2.src"
                src={aboutIntro.accentPhoto2.src}
                alt={aboutIntro.accentPhoto2.alt}
                sizes="96px"
                fallbackSrc="/sameermalik2.webp"
              />
            </div>
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <SectionHeading
              eyebrow={aboutIntro.eyebrow}
              title={aboutIntro.title}
              contentPathPrefix="home.aboutIntro"
            />

            <StaggerContainer
              className="mt-6 space-y-4 text-text-secondary leading-relaxed"
              stagger={0.25}
            >
              <StaggerItem>
                <EditableText contentPath="home.aboutIntro.paragraph1" as="p">
                  {aboutIntro.paragraph1}
                </EditableText>
              </StaggerItem>
              <StaggerItem>
                <EditableText contentPath="home.aboutIntro.paragraph2" as="p">
                  {aboutIntro.paragraph2}
                </EditableText>
              </StaggerItem>
            </StaggerContainer>

            <ul className="mt-8 space-y-3">
              {aboutIntro.highlights.map((highlight, index) => (
                <li
                  key={highlight.id}
                  className="flex items-center gap-3 text-sm text-text-secondary"
                >
                  <EditableIcon
                    contentPath={`home.aboutIntro.highlights.${index}.iconKey`}
                    iconKey={highlight.iconKey}
                    wrapperClassName="h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    iconClassName="h-4 w-4"
                  />
                  <EditableText
                    contentPath={`home.aboutIntro.highlights.${index}.label`}
                    as="span"
                  >
                    {highlight.label}
                  </EditableText>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Button href="/about" variant="secondary">
                More About Me
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </MotionReveal>
        </div>
      </Container>
    </section>
  );
}
