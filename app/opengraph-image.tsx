import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0b1210",
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(16,185,129,0.35), transparent 45%), radial-gradient(circle at 90% 20%, rgba(251,191,36,0.25), transparent 40%), radial-gradient(circle at 50% 100%, rgba(139,92,246,0.2), transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              height: 14,
              width: 14,
              borderRadius: 999,
              backgroundColor: "#fbbf24",
            }}
          />
          <span style={{ fontSize: 28, color: "#fbbf24", fontWeight: 600 }}>
            {siteConfig.name}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 64,
            fontWeight: 700,
            color: "#f4f6f5",
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Website Design, WordPress &amp; WhatsApp Bot Developer
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: "#a8b3ae",
            maxWidth: 900,
          }}
        >
          Fast, SEO-friendly websites and AI automation for businesses worldwide.
        </div>
      </div>
    ),
    { ...size }
  );
}
