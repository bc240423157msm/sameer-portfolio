import { getSiteContent } from "@/lib/data";
import { TechStackClient } from "./TechStackClient";

export async function TechStackWrapper() {
  const content = await getSiteContent();
  return <TechStackClient techStack={content.home.techStack} />;
}
