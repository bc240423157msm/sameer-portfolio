import { getSiteContent } from "@/lib/data";
import { HeroClient } from "./HeroClient";

export async function Hero() {
  const content = await getSiteContent();
  return (
    <HeroClient
      hero={content.hero}
      headerImage={content.settings.pageHeaders.home}
      branding={content.settings.branding}
    />
  );
}
