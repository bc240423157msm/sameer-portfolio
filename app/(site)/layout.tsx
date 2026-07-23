import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { SamChatWidgetLoader } from "@/components/chat/SamChatWidgetLoader";
import { getSiteContent } from "@/lib/data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  return (
    <div className="flex min-h-screen flex-col">
      <GoogleAnalytics measurementId={content.settings.gaMeasurementId} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar
        logoSrc={content.settings.branding.logoSrc}
        logoAlt={content.settings.branding.logoAlt}
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <SamChatWidgetLoader />
      <WhatsAppButton phoneNumber={content.settings.whatsappNumber} />
    </div>
  );
}
