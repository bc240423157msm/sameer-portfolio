import { getSession } from "@/lib/auth";
import { getSiteContent, getCustomPages } from "@/lib/data";
import { SiteLayoutClient } from "@/components/layout/SiteLayoutClient";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [content, session, customPages] = await Promise.all([
    getSiteContent(),
    getSession(),
    getCustomPages(),
  ]);

  const isAdmin =
    session?.role === "admin" || session?.role === "seo";

  const extraNavLinks = customPages
    .filter((p) => p.published && p.showInNav)
    .map((p) => ({ label: p.title, href: `/pages/${p.slug}` }));

  return (
    <SiteLayoutClient
      gaMeasurementId={content.settings.gaMeasurementId}
      whatsappNumber={content.settings.whatsappNumber}
      branding={content.settings.branding}
      socialLinks={content.settings.socialLinks}
      navLinks={content.settings.navLinks}
      footerLinks={content.settings.footerLinks}
      footerDescription={content.settings.footerDescription}
      isAdmin={!!isAdmin}
      extraNavLinks={extraNavLinks}
    >
      {children}
    </SiteLayoutClient>
  );
}
