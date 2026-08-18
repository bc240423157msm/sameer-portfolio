import { getSiteContent } from "@/lib/data";
import { ServicesPreviewClient } from "./ServicesPreviewClient";

export async function ServicesPreviewWrapper() {
  const content = await getSiteContent();
  return <ServicesPreviewClient servicesPreview={content.home.servicesPreview} />;
}
