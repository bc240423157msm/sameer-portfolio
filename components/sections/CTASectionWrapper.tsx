import { getSiteContent } from "@/lib/data";
import { CTASection } from "./CTASection";

export async function CTASectionWrapper() {
  const content = await getSiteContent();
  return (
    <CTASection
      calendlyUrl={content.settings.calendlyUrl}
      title={content.home.cta.title}
      description={content.home.cta.description}
    />
  );
}
