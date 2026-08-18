"use client";

import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  Clock,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { EditableText } from "@/components/common/EditableText";
import type { SiteContent } from "@/types/content";

interface ContactPageClientProps {
  contact: SiteContent["contact"];
  contactPage: SiteContent["contactPage"];
  faq: SiteContent["faq"];
  whatsappHref: string | null;
}

export function ContactPageClient({
  contact,
  contactPage,
  faq,
  whatsappHref,
}: ContactPageClientProps) {
  return (
    <>
      <section className="py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <SectionHeading
                eyebrow={contactPage.getInTouch.eyebrow}
                title={contactPage.getInTouch.title}
                description={contactPage.getInTouch.description}
                contentPathPrefix="contactPage.getInTouch"
              />

              <div className="mt-10 space-y-6">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Email</p>
                    <EditableText
                      contentPath="contact.email"
                      as="p"
                      className="mt-1 text-sm text-text-secondary"
                    >
                      {contact.email}
                    </EditableText>
                  </div>
                </a>

                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-accent/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        WhatsApp
                      </p>
                      <EditableText
                        contentPath="contact.whatsapp"
                        as="p"
                        className="mt-1 text-sm text-text-secondary"
                      >
                        {contact.whatsapp}
                      </EditableText>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        WhatsApp
                      </p>
                      <EditableText
                        contentPath="contact.whatsapp"
                        as="p"
                        className="mt-1 text-sm text-text-secondary"
                      >
                        {contact.whatsapp}
                      </EditableText>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Location
                    </p>
                    <EditableText
                      contentPath="contact.location"
                      as="p"
                      className="mt-1 text-sm text-text-secondary"
                    >
                      {contact.location}
                    </EditableText>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Response Time
                    </p>
                    <EditableText
                      contentPath="contactPage.responseTime"
                      as="p"
                      className="mt-1 text-sm text-text-secondary"
                    >
                      {contactPage.responseTime}
                    </EditableText>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm">
                <div className="mb-6 flex items-center gap-3">
                  <Send className="h-5 w-5 text-primary" />
                  <EditableText
                    contentPath="contactPage.formTitle"
                    as="h2"
                    className="text-lg font-semibold text-text-primary"
                  >
                    {contactPage.formTitle}
                  </EditableText>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-surface/50 py-24">
        <Container>
          <SectionHeading
            eyebrow={contactPage.faq.eyebrow}
            title={contactPage.faq.title}
            align="center"
            className="mx-auto"
            contentPathPrefix="contactPage.faq"
          />
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faq.slice(0, 6).map((item, index) => (
              <details
                key={`${item.question}-${index}`}
                className="group rounded-xl border border-border/60 bg-card/40"
              >
                <summary className="cursor-pointer list-none p-6 font-medium text-text-primary [&::-webkit-details-marker]:hidden">
                  <EditableText contentPath={`faq.${index}.question`} as="span">
                    {item.question}
                  </EditableText>
                </summary>
                <EditableText
                  contentPath={`faq.${index}.answer`}
                  as="p"
                  className="border-t border-border/40 px-6 pb-6 pt-4 text-sm leading-relaxed text-text-secondary"
                >
                  {item.answer}
                </EditableText>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
