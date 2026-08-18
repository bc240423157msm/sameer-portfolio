"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { SamChatWidgetLoader } from "@/components/chat/SamChatWidgetLoader";
import { ScrollProgressBar } from "@/components/common/ScrollProgressBar";
import { CursorTrail } from "@/components/common/CursorTrail";
import { AutoTranslate } from "@/components/common/AutoTranslate";
import { ToastProvider } from "@/components/ui/Toast";
import { AdminToolbar } from "@/components/portal/AdminToolbar";
import type { SiteBranding, SocialLink } from "@/types/content";
import type { NavLink } from "@/types";

interface SiteLayoutClientProps {
  children: React.ReactNode;
  gaMeasurementId: string;
  whatsappNumber: string;
  branding: SiteBranding;
  socialLinks: SocialLink[];
  navLinks: NavLink[];
  footerLinks: NavLink[];
  footerDescription: string;
  isAdmin: boolean;
  extraNavLinks?: NavLink[];
}

export function SiteLayoutClient({
  children,
  gaMeasurementId,
  whatsappNumber,
  branding,
  socialLinks,
  navLinks,
  footerLinks,
  footerDescription,
  isAdmin,
  extraNavLinks = [],
}: SiteLayoutClientProps) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        <CursorTrail />
        <ScrollProgressBar />
        <GoogleAnalytics measurementId={gaMeasurementId} />
        <AutoTranslate />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>
        {isAdmin && <AdminToolbar />}
        <Navbar
          logoSrc={branding.logoSrc}
          logoAlt={branding.logoAlt}
          logoWidth={branding.logoWidth}
          navLinks={navLinks}
          extraNavLinks={extraNavLinks}
          isAdmin={isAdmin}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer
          socialLinks={socialLinks}
          navLinks={navLinks}
          footerLinks={footerLinks}
          description={footerDescription}
        />
        <SamChatWidgetLoader />
        <WhatsAppButton phoneNumber={whatsappNumber} />
      </div>
    </ToastProvider>
  );
}
