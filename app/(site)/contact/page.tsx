import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactPageClient } from "@/components/sections/ContactPageClient";
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
  const { contact, contactPage, faq, settings } = content;
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
        eyebrow={content.settings.pageHeroText.contact.eyebrow}
        title={content.settings.pageHeroText.contact.title}
        description={content.settings.pageHeroText.contact.description}
      />

      <ContactPageClient
        contact={contact}
        contactPage={contactPage}
        faq={faq}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
