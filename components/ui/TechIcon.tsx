interface TechIconProps {
  slug: string;
  className?: string;
}

export function TechIcon({ slug, className = "h-8 w-8" }: TechIconProps) {
  switch (slug) {
    case "react":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="2" fill="#61DAFB" />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            stroke="#61DAFB"
            strokeWidth="1.2"
            fill="none"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            stroke="#61DAFB"
            strokeWidth="1.2"
            fill="none"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10"
            ry="4"
            stroke="#61DAFB"
            strokeWidth="1.2"
            fill="none"
            transform="rotate(120 12 12)"
          />
        </svg>
      );
    case "nextjs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5V8.5l6 4.5-6 4.5z"
            className="text-text-primary"
          />
        </svg>
      );
    case "typescript":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="3" fill="#3178C6" />
          <path
            d="M13.5 16.5v2.1c.9.5 1.9.8 3 .8 2.5 0 4-1.3 4-3.5 0-1.8-1-2.8-3.2-3.8l-1.1-.6c-1-.5-1.4-.9-1.4-1.5 0-.7.6-1.1 1.6-1.1 1 0 1.8.3 2.4.8v-2c-.8-.4-1.8-.6-2.8-.6-2.3 0-3.8 1.2-3.8 3.2 0 1.9 1.1 2.8 3 3.7l1.3.7c1 .6 1.3 1 1.3 1.6 0 .8-.7 1.2-1.9 1.2-1.1 0-2.1-.4-2.8-1.1zM8.5 16.5H6.2l2.5-9h2.3l-2.5 9z"
            fill="white"
          />
        </svg>
      );
    case "nodejs":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.8v-5.2l4.8 2.6-4.8 2.6zm1.2-8.4c-3.5 0-6.4 2.9-6.4 6.4s2.9 6.4 6.4 6.4 6.4-2.9 6.4-6.4-2.9-6.4-6.4-6.4z"
            fill="#339933"
          />
        </svg>
      );
    case "tailwind":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 6c-2.5 0-4 1.25-4.5 3.75 0.9-1.25 1.95-1.72 3.15-1.42 0.69 0.17 1.18 0.67 1.73 1.22 0.89 0.89 1.92 1.92 4.12 1.92 2.5 0 4-1.25 4.5-3.75-0.9 1.25-1.95 1.72-3.15 1.42-0.69-0.17-1.18-0.67-1.73-1.22-0.89-0.89-1.92-1.92-4.12-1.92zM7.5 12c-2.5 0-4 1.25-4.5 3.75 0.9-1.25 1.95-1.72 3.15-1.42 0.69 0.17 1.18 0.67 1.73 1.22 0.89 0.89 1.92 1.92 4.12 1.92 2.5 0 4-1.25 4.5-3.75-0.9 1.25-1.95 1.72-3.15 1.42-0.69-0.17-1.18-0.67-1.73-1.22-0.89-0.89-1.92-1.92-4.12-1.92z"
            fill="#38BDF8"
          />
        </svg>
      );
    case "wordpress":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#21759B" />
          <path
            d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-3.5 12.5L14 7.5c.3-.8 1-.8 1.3 0l1.2 3.5-2.5 5.5-3.5-4z"
            fill="white"
          />
        </svg>
      );
    case "postgresql":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2C8 2 5 5 5 9c0 3 1.5 5.5 4 7v4l3-2 3 2v-4c2.5-1.5 4-4 4-7 0-4-3-7-7-7z"
            fill="#336791"
          />
        </svg>
      );
    case "supabase":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2L4 20h16L12 2zm0 6l4 8H8l4-8z"
            fill="#3ECF8E"
          />
        </svg>
      );
    case "git":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.26-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85.004 1.71.12 2.51.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.4.2 2.44.1 2.7.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"
            fill="#F05032"
          />
        </svg>
      );
    case "github":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.26-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85.004 1.71.12 2.51.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.4.2 2.44.1 2.7.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"
            className="text-text-primary"
          />
        </svg>
      );
    default:
      return (
        <div
          className={`${className} flex items-center justify-center rounded-md bg-surface text-xs font-bold text-text-muted`}
        >
          ?
        </div>
      );
  }
}
