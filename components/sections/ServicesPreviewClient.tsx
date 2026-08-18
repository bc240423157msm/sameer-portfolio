"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "@/components/common/TiltCard";
import { Container } from "@/components/layout/Container";
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/MotionReveal";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EditableText } from "@/components/common/EditableText";
import { EditableIcon } from "@/components/common/EditableIcon";
import { cn } from "@/utils/cn";
import type { SiteContent } from "@/types/content";

interface ServicesPreviewClientProps {
  servicesPreview: SiteContent["home"]["servicesPreview"];
}

export function ServicesPreviewClient({
  servicesPreview,
}: ServicesPreviewClientProps) {
  return (
    <section className="border-b border-border/60 py-24">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow={servicesPreview.eyebrow}
            title={servicesPreview.title}
            description={servicesPreview.description}
            contentPathPrefix="home.servicesPreview"
          />
        </MotionReveal>

        <StaggerContainer className="mt-16 grid gap-6 md:grid-cols-3">
          {servicesPreview.items.map((service, index) => (
            <StaggerItem key={service.id}>
              <TiltCard className="h-full">
                <div className="group flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/5">
                  <EditableIcon
                    contentPath={`home.servicesPreview.items.${index}.iconKey`}
                    iconKey={service.iconKey}
                    wrapperClassName="mb-6 h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20"
                    iconClassName="h-6 w-6"
                  />

                  <EditableText
                    contentPath={`home.servicesPreview.items.${index}.title`}
                    as="h3"
                    className="text-xl font-semibold text-text-primary"
                  >
                    {service.title}
                  </EditableText>
                  <EditableText
                    contentPath={`home.servicesPreview.items.${index}.description`}
                    as="p"
                    className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary"
                  >
                    {service.description}
                  </EditableText>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <Badge key={feature}>{feature}</Badge>
                    ))}
                  </div>

                  <Link
                    href={service.href}
                    aria-label={`Learn more about ${service.title}`}
                    className={cn(
                      "mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-primary"
                    )}
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
