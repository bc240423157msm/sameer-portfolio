"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MotionReveal, StaggerContainer, StaggerItem } from "@/components/common/MotionReveal";
import { EditableText } from "@/components/common/EditableText";
import { useEditMode } from "@/components/portal/AdminToolbar";
import { cn } from "@/utils/cn";
import type { SiteContent } from "@/types/content";

interface FAQSectionClientProps {
  faq: SiteContent["faq"];
}

export function FAQSectionClient({ faq }: FAQSectionClientProps) {
  const editMode = useEditMode();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-border/60 py-24">
      <Container>
        <MotionReveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Quick answers to the questions I get asked most often."
            align="center"
            className="mx-auto"
          />
        </MotionReveal>

        <StaggerContainer className="mx-auto mt-12 max-w-3xl space-y-4">
          {faq.map((item, index) => {
            // In edit mode every answer stays visible so it can be edited —
            // the collapse/expand toggle only applies to normal browsing.
            const isOpen = editMode || openIndex === index;

            return (
              <StaggerItem key={index}>
                <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => !editMode && setOpenIndex(isOpen ? null : index)}
                    onKeyDown={(e) => {
                      if (editMode) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpenIndex(openIndex === index ? null : index);
                      }
                    }}
                    aria-expanded={isOpen}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 p-6 text-left",
                      !editMode && "cursor-pointer select-none"
                    )}
                  >
                    <EditableText
                      contentPath={`faq.${index}.question`}
                      as="h3"
                      className="font-medium text-text-primary"
                    >
                      {item.question}
                    </EditableText>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-text-muted transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                      aria-hidden
                    />
                  </div>
                  {isOpen && (
                    <div className="border-t border-border/40 px-6 pb-6 pt-4">
                      <EditableText
                        contentPath={`faq.${index}.answer`}
                        as="p"
                        className="text-sm leading-relaxed text-text-secondary"
                      >
                        {item.answer}
                      </EditableText>
                    </div>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}
