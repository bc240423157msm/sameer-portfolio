"use client";

import { Container } from "@/components/layout/Container";
import { MotionReveal } from "@/components/common/MotionReveal";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { EditableText } from "@/components/common/EditableText";
import { useEditMode } from "@/components/portal/AdminToolbar";
import type { SiteContent } from "@/types/content";

interface StatsSectionClientProps {
  stats: SiteContent["home"]["stats"];
}

export function StatsSectionClient({ stats }: StatsSectionClientProps) {
  const editMode = useEditMode();

  return (
    <section className="border-b border-border/60 py-16">
      <Container>
        <MotionReveal>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.id} className="text-center">
                <p className="text-3xl font-bold text-primary sm:text-4xl">
                  {editMode ? (
                    <>
                      <EditableText
                        contentPath={`home.stats.${index}.value`}
                        as="span"
                      >
                        {String(stat.value)}
                      </EditableText>
                      <EditableText
                        contentPath={`home.stats.${index}.suffix`}
                        as="span"
                      >
                        {stat.suffix}
                      </EditableText>
                    </>
                  ) : (
                    <AnimatedCounter
                      value={Number(stat.value) || 0}
                      suffix={stat.suffix}
                    />
                  )}
                </p>
                <EditableText
                  contentPath={`home.stats.${index}.label`}
                  as="p"
                  className="mt-2 text-sm text-text-secondary"
                >
                  {stat.label}
                </EditableText>
              </div>
            ))}
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
