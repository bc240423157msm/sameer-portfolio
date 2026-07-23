import type { Metadata } from "next";
import { SeoDashboard } from "@/components/portal/SeoDashboard";
import { getBlogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "SEO Dashboard",
  robots: { index: false, follow: false },
};

export default async function SeoPage() {
  const posts = await getBlogPosts();
  return <SeoDashboard initialPosts={posts} />;
}
