"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import {
  MotionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/common/MotionReveal";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { servicePreviews } from "@/lib/content";
import { cn } from "@/utils/cn";

export function ServicesPreview() {
  return (
    <section className="border-b border-border/60 py-24">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="Services"
            title="Solutions built for your business"
            description="From custom websites to AI automation — I help you ship faster, work smarter, and grow with confidence."
          />
        </MotionReveal>

        <StaggerContainer className="mt-16 grid gap-6 md:grid-cols-3">
          {servicePreviews.map((service) => {
            const Icon = service.icon;
            return (
              <StaggerItem key={service.title}>
                <div className="group flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/5">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                    {service.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <Badge key={feature}>{feature}</Badge>
                    ))}
                  </div>

                  <Link
                    href={service.href}
                    className={cn(
                      "mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-primary"
                    )}
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}
