import { getSiteContent } from "@/lib/data";
import { StatsSectionClient } from "./StatsSectionClient";

export async function StatsSectionWrapper() {
  const content = await getSiteContent();
  return <StatsSectionClient stats={content.home.stats} />;
}
