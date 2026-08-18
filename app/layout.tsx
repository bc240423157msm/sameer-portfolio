import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter/standard.css";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  personJsonLd,
  professionalServiceJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { themeInitScript } from "@/lib/theme-script";
import { getSiteContent } from "@/lib/data";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1210" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const { seo } = content.settings;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    verification: {
      ...(seo.googleSiteVerification
        ? { google: seo.googleSiteVerification }
        : {}),
      ...(seo.bingSiteVerification || seo.pinterestVerification
        ? {
            other: {
              ...(seo.bingSiteVerification
                ? { "msvalidate.01": seo.bingSiteVerification }
                : {}),
              ...(seo.pinterestVerification
                ? { "p:domain_verify": seo.pinterestVerification }
                : {}),
            },
          }
        : {}),
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: siteConfig.url,
      types: {
        "application/rss+xml": `${siteConfig.url}/feed.xml`,
      },
    },
    openGraph: {
      title: siteConfig.title,
      description: siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: siteConfig.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();
  const gtmId = content.settings.seo.googleTagManagerId;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
      </head>
      {/* suppressHydrationWarning add kar diya hai taake extension attributes issue na karein */}
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <JsonLd
          data={[personJsonLd(), websiteJsonLd(), professionalServiceJsonLd()]}
        />
        {children}
      </body>
    </html>
  );
}
