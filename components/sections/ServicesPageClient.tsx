"use client";

import { Check } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { EditableText } from "@/components/common/EditableText";
import { EditableIcon } from "@/components/common/EditableIcon";
import type { SiteContent } from "@/types/content";

interface ServicesPageClientProps {
  services: SiteContent["services"];
}

export function ServicesPageClient({ services }: ServicesPageClientProps) {
  return (
    <section className="py-24">
      <Container>
        <div className="space-y-8">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="group rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <EditableIcon
                        contentPath={`services.${index}.iconKey`}
                        iconKey={service.iconKey}
                        iconClassName="h-6 w-6"
                      />
                    </span>
                    <span className="text-sm font-medium text-accent">
                      0{index + 1}
                    </span>
                  </div>
                  <EditableText
                    contentPath={`services.${index}.title`}
                    as="h2"
                    className="text-2xl font-semibold text-text-primary"
                  >
                    {service.title}
                  </EditableText>
                  <EditableText
                    contentPath={`services.${index}.shortDescription`}
                    as="p"
                    className="mt-4 text-text-secondary leading-relaxed"
                  >
                    {service.shortDescription}
                  </EditableText>

                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={`${feature}-${featureIndex}`}
                        className="flex items-center gap-2 text-sm text-text-secondary"
                      >
                        <Check className="h-4 w-4 shrink-0 text-accent" />
                        <EditableText
                          contentPath={`services.${index}.features.${featureIndex}`}
                          as="span"
                        >
                          {feature}
                        </EditableText>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-border/40 bg-surface/30 p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    Technologies
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.technologies.map((tech, techIndex) => (
                      <Badge key={`${tech}-${techIndex}`}>
                        <EditableText
                          contentPath={`services.${index}.technologies.${techIndex}`}
                          as="span"
                        >
                          {tech}
                        </EditableText>
                      </Badge>
                    ))}
                  </div>

                  {service.startingPrice && (
                    <>
                      <p className="mt-6 text-xs font-medium uppercase tracking-wider text-text-muted">
                        Pricing
                      </p>
                      <EditableText
                        contentPath={`services.${index}.startingPrice`}
                        as="p"
                        className="mt-2 text-sm font-semibold text-primary"
                      >
                        {service.startingPrice}
                      </EditableText>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
