import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  Briefcase,
  Newspaper,
  Mail,
  Wrench,
  Search,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/common/MotionReveal";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist or has moved. Explore the site from here instead.",
  robots: { index: false, follow: true },
};

const quickLinks = [
  { label: "Home", href: "/", icon: Home, description: "Back to the start" },
  { label: "Services", href: "/services", icon: Wrench, description: "What I offer" },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase, description: "Recent work" },
  { label: "Blog", href: "/blog", icon: Newspaper, description: "Latest writing" },
  { label: "Contact", href: "/contact", icon: Mail, description: "Get in touch" },
];

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 55%)",
        }}
      />
      <Container className="text-center">
        <MotionReveal>
          <svg
            viewBox="0 0 240 140"
            className="mx-auto mb-6 h-32 w-auto sm:h-40"
            aria-hidden
          >
            <text
              x="120"
              y="105"
              textAnchor="middle"
              fontSize="110"
              fontWeight="700"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              fontFamily="var(--font-heading)"
            >
              404
            </text>
            <circle
              cx="120"
              cy="115"
              r="4"
              fill="var(--color-accent)"
              className="animate-[cursorPulse_1.8s_ease-in-out_infinite]"
            />
          </svg>

          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Lost in the wrong direction
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-text-primary sm:text-5xl">
            This page took a wrong turn
          </h1>
          <p className="mx-auto mt-4 max-w-md text-text-secondary">
            The link you followed might be broken, or the page may have been
            moved. Let&apos;s get you back on track.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/">
              <Home className="mr-2 inline h-4 w-4" aria-hidden />
              Go to Homepage
            </Button>
            <Link
              href="/contact"
              className="text-sm font-medium text-accent transition-colors hover:text-primary"
            >
              Report a broken link
            </Link>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <div className="mx-auto mt-16 max-w-3xl">
            <p className="mb-5 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider text-text-muted">
              <Search className="h-3.5 w-3.5" aria-hidden />
              Or jump straight to
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {quickLinks.map(({ label, href, icon: Icon, description }) => (
                <Link
                  key={href}
                  href={href}
                  data-cursor="button"
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card/40 p-4 text-center transition-colors hover:border-primary/50 hover:bg-card"
                >
                  <Icon
                    className="h-5 w-5 text-text-secondary transition-colors group-hover:text-primary"
                    aria-hidden
                  />
                  <span className="text-sm font-medium text-text-primary">
                    {label}
                  </span>
                  <span className="hidden text-xs text-text-muted sm:block">
                    {description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
