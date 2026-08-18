import { getSiteContent } from "@/lib/data";
import { AboutIntroClient } from "./AboutIntroClient";

export async function AboutIntroWrapper() {
  const content = await getSiteContent();
  return <AboutIntroClient aboutIntro={content.home.aboutIntro} />;
}
