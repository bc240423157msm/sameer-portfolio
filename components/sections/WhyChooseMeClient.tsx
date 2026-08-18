"use client";

import { TiltCard } from "@/components/common/TiltCard";
import { Container } from "@/components/layout/Container";
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EditableText } from "@/components/common/EditableText";
import { EditableIcon } from "@/components/common/EditableIcon";
import type { SiteContent } from "@/types/content";

interface WhyChooseMeClientProps {
  whyChooseMe: SiteContent["home"]["whyChooseMe"];
}

export function WhyChooseMeClient({ whyChooseMe }: WhyChooseMeClientProps) {
  return (
    <section className="border-b border-border/60 bg-surface/50 py-24">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow={whyChooseMe.eyebrow}
            title={whyChooseMe.title}
            description={whyChooseMe.description}
            align="center"
            className="mx-auto"
            contentPathPrefix="home.whyChooseMe"
          />
        </MotionReveal>

        <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseMe.items.map((item, index) => (
            <StaggerItem key={item.id}>
              <TiltCard className="h-full">
                <div className="h-full rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-card/70">
                  <EditableIcon
                    contentPath={`home.whyChooseMe.items.${index}.iconKey`}
                    iconKey={item.iconKey}
                    wrapperClassName="mb-4 h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent"
                    iconClassName="h-5 w-5"
                  />
                  <EditableText
                    contentPath={`home.whyChooseMe.items.${index}.title`}
                    as="h3"
                    className="font-semibold text-text-primary"
                  >
                    {item.title}
                  </EditableText>
                  <EditableText
                    contentPath={`home.whyChooseMe.items.${index}.description`}
                    as="p"
                    className="mt-2 text-sm leading-relaxed text-text-secondary"
                  >
                    {item.description}
                  </EditableText>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
