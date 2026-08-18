import type { Metadata } from "next";
import { getSiteContent } from "@/lib/data";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();
  const { branding, navLinks } = content.settings;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        logoSrc={branding.logoSrc}
        logoAlt={branding.logoAlt}
        logoWidth={branding.logoWidth}
        navLinks={navLinks}
        alwaysVisible
      />
      <div className="flex-1 pt-[72px]">{children}</div>
    </div>
  );
}
