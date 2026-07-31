import type { Metadata } from "next";
import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  Clock,
} from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { getSiteContent } from "@/lib/data";
import { breadcrumbJsonLd, createPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Sameer Malik for website design, website redesign, WordPress development, WhatsApp bots, and AI chatbots. Get a free consultation for your project.",
  path: "/contact",
  keywords: ["Hire Web Developer", "Website Design Quote", "WhatsApp Bot Developer"],
});

export const revalidate = 3600;

export default async function ContactPage() {
  const content = await getSiteContent();
  const { contact, faq, settings } = content;
  const whatsappHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`
    : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          faqJsonLd(faq.slice(0, 6)),
        ]}
      />
      <PageHero
        variant="contact"
        eyebrow="Contact"
        title="Let's build something together"
        description="Tell me about your project and I'll get back to you within 24 hours to discuss the details."
      />

      <section className="py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <SectionHeading
                eyebrow="Get in Touch"
                title="Start a conversation"
                description="Whether you need a new website, an AI chatbot, or help with an existing project — I'm here to help."
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
                    <p className="mt-1 text-sm text-text-secondary">
                      {contact.email}
                    </p>
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
                      <p className="mt-1 text-sm text-text-secondary">
                        {contact.whatsapp}
                      </p>
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
                      <p className="mt-1 text-sm text-text-secondary">
                        {contact.whatsapp}
                      </p>
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
                    <p className="mt-1 text-sm text-text-secondary">
                      {contact.location}
                    </p>
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
                    <p className="mt-1 text-sm text-text-secondary">
                      Within 24 hours on business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm">
                <div className="mb-6 flex items-center gap-3">
                  <Send className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-text-primary">
                    Send a Message
                  </h2>
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
            eyebrow="FAQ"
            title="Common questions"
            align="center"
            className="mx-auto"
          />
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faq.slice(0, 6).map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-border/60 bg-card/40"
              >
                <summary className="cursor-pointer list-none p-6 font-medium text-text-primary [&::-webkit-details-marker]:hidden">
                  {item.question}
                </summary>
                <p className="border-t border-border/40 px-6 pb-6 pt-4 text-sm leading-relaxed text-text-secondary">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
