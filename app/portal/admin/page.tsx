import type { Metadata } from "next";
import { AdminDashboard } from "@/components/portal/AdminDashboard";
import { getBlogPosts, getContactSubmissions, getSiteContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [content, posts, submissions] = await Promise.all([
    getSiteContent(),
    getBlogPosts(),
    getContactSubmissions(),
  ]);

  return (
    <AdminDashboard
      initialContent={content}
      initialPosts={posts}
      initialSubmissions={submissions}
    />
  );
}
