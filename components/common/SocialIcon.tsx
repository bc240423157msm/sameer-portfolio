import { Globe, Link2, Mail, Briefcase, Handshake } from "lucide-react";

/** Platforms selectable from the admin dashboard. `id` is stored on the
 * SocialLink and drives which icon renders — add new entries here to
 * support more platforms later. */
export const SOCIAL_PLATFORMS: { id: string; label: string }[] = [
  { id: "github", label: "GitHub" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "twitter", label: "Twitter / X" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "youtube", label: "YouTube" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "tiktok", label: "TikTok" },
  { id: "upwork", label: "Upwork" },
  { id: "fiverr", label: "Fiverr" },
  { id: "email", label: "Email" },
  { id: "website", label: "Website" },
  { id: "custom", label: "Other / Custom" },
];

function IconWrap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Renders the icon for a given platform id. Falls back to a generic link
 * icon for anything unrecognized (e.g. a custom platform). */
export function SocialIcon({
  platform,
  className = "h-5 w-5",
}: {
  platform: string;
  className?: string;
}) {
  switch (platform) {
    case "github":
      return (
        <IconWrap className={className}>
          <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
        </IconWrap>
      );
    case "linkedin":
      return (
        <IconWrap className={className}>
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
        </IconWrap>
      );
    case "twitter":
      return (
        <IconWrap className={className}>
          <path d="M18.9 2.6h3.4l-7.4 8.5 8.7 10.3h-6.8l-5.3-6.5-6.1 6.5H1.9l7.9-9-8.3-9.8h7l4.8 6 5.6-6Zm-1.2 17h1.9L7.4 4.5H5.4L17.7 19.6Z" />
        </IconWrap>
      );
    case "instagram":
      return (
        <IconWrap className={className}>
          <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.61.24 1.05.52 1.51.98.46.46.74.9.98 1.51.17.46.36 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4.1 4.1 0 0 1-.98 1.51 4.1 4.1 0 0 1-1.51.98c-.46.17-1.26.36-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.1 4.1 0 0 1-1.51-.98 4.1 4.1 0 0 1-.98-1.51c-.17-.46-.36-1.26-.4-2.43C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.24-.61.52-1.05.98-1.51.46-.46.9-.74 1.51-.98.46-.17 1.26-.36 2.43-.4C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5.01-4.73.07-.96.04-1.48.2-1.83.34-.46.18-.78.4-1.13.74-.34.35-.56.67-.74 1.13-.14.35-.3.87-.34 1.83-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.04.96.2 1.48.34 1.83.18.46.4.78.74 1.13.35.34.67.56 1.13.74.35.14.87.3 1.83.34 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.96-.04 1.48-.2 1.83-.34.46-.18.78-.4 1.13-.74.34-.35.56-.67.74-1.13.14-.35.3-.87.34-1.83.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.96-.2-1.48-.34-1.83a3 3 0 0 0-.74-1.13 3 3 0 0 0-1.13-.74c-.35-.14-.87-.3-1.83-.34C15.5 4.01 15.15 4 12 4Zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9Zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Zm5.16-1.98a1.16 1.16 0 1 1-2.31 0 1.16 1.16 0 0 1 2.31 0Z" />
        </IconWrap>
      );
    case "facebook":
      return (
        <IconWrap className={className}>
          <path d="M13.5 21.5v-8.1h2.72l.41-3.16h-3.13V8.24c0-.91.25-1.53 1.56-1.53h1.66V3.9c-.29-.04-1.27-.12-2.42-.12-2.4 0-4.04 1.46-4.04 4.15v2.31H7.53v3.16h2.73v8.1h3.24Z" />
        </IconWrap>
      );
    case "youtube":
      return (
        <IconWrap className={className}>
          <path d="M23.5 7.2s-.23-1.64-.94-2.36c-.9-.94-1.9-.95-2.36-1C17.05 3.5 12 3.5 12 3.5h-.01s-5.05 0-8.2.34c-.46.05-1.46.06-2.36 1-.71.72-.94 2.36-.94 2.36S.2 9.14.2 11.08v1.83c0 1.94.29 3.88.29 3.88s.23 1.64.94 2.36c.9.94 2.08.91 2.6 1.01 1.89.18 8.02.34 8.02.34s5.05-.01 8.2-.35c.46-.05 1.46-.06 2.36-1 .71-.72.94-2.36.94-2.36s.29-1.94.29-3.88v-1.83c0-1.94-.29-3.88-.29-3.88ZM9.7 15.3V8.7l6.35 3.3-6.35 3.3Z" />
        </IconWrap>
      );
    case "whatsapp":
      return (
        <IconWrap className={className}>
          <path d="M17.47 14.38c-.29-.14-1.71-.84-1.98-.94-.27-.1-.46-.14-.65.14-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.65-1.57-.9-2.15-.24-.57-.48-.49-.65-.5-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.42 0 1.43 1.02 2.82 1.17 3.01.14.19 2 3.05 4.84 4.28.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33ZM12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.32A9.94 9.94 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2Zm0 18.13c-1.7 0-3.29-.47-4.65-1.28l-.33-.2-3.15.82.84-3.07-.22-.32A8.07 8.07 0 0 1 3.9 12c0-4.48 3.65-8.13 8.12-8.13 4.48 0 8.12 3.65 8.12 8.13 0 4.48-3.64 8.13-8.12 8.13Z" />
        </IconWrap>
      );
    case "tiktok":
      return (
        <IconWrap className={className}>
          <path d="M16.5 2h-3.1v13.4a2.9 2.9 0 1 1-2.06-2.78V9.4a6.1 6.1 0 1 0 5.16 6.02V9.98a7.6 7.6 0 0 0 4.5 1.45V8.3a4.5 4.5 0 0 1-4.5-4.5V2Z" />
        </IconWrap>
      );
    case "upwork":
      return <Briefcase className={className} strokeWidth={1.8} />;
    case "fiverr":
      return <Handshake className={className} strokeWidth={1.8} />;
    case "email":
      return <Mail className={className} strokeWidth={1.8} />;
    case "website":
      return <Globe className={className} strokeWidth={1.8} />;
    default:
      return <Link2 className={className} strokeWidth={1.8} />;
  }
}
