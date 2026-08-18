import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteContent } from "@/lib/data";
import { faqJsonLd } from "@/lib/seo";
import { FAQSectionClient } from "./FAQSectionClient";

export async function FAQSection() {
  const content = await getSiteContent();
  const { faq } = content;

  if (faq.length === 0) return null;

  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <FAQSectionClient faq={faq} />
    </>
  );
}
