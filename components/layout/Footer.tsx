import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { BackToTopButton } from "@/components/common/BackToTopButton";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";
import { SocialIcon } from "@/components/common/SocialIcon";
import { footerLinks, navLinks, siteConfig } from "@/lib/site-config";
import type { SocialLink } from "@/types/content";

interface FooterProps {
  socialLinks?: SocialLink[];
}

export function Footer({ socialLinks = [] }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-surface">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="font-heading text-lg font-semibold text-text-primary transition-colors hover:text-accent"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-3 max-w-sm text-sm text-text-secondary">
              Full Stack Web Developer & AI Automation Specialist building
              fast, SEO-friendly websites and intelligent automation for
              businesses worldwide.
            </p>
            <NewsletterSignup />
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-sm font-medium text-text-primary">Quick Links</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Social links">
            <p className="text-sm font-medium text-text-primary">Connect</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {socialLinks
                .filter((link) => link.href?.trim())
                .map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      title={link.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-primary hover:text-primary"
                    >
                      <SocialIcon platform={link.platform} className="h-[18px] w-[18px]" />
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-text-muted">
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-text-muted transition-colors hover:text-text-secondary"
              >
                {link.label}
              </Link>
            ))}
            <BackToTopButton />
          </div>
        </div>
      </Container>
    </footer>
  );
}
