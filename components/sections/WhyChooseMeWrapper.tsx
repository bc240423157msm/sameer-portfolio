import { getSiteContent } from "@/lib/data";
import { WhyChooseMeClient } from "./WhyChooseMeClient";

export async function WhyChooseMeWrapper() {
  const content = await getSiteContent();
  return <WhyChooseMeClient whyChooseMe={content.home.whyChooseMe} />;
}
