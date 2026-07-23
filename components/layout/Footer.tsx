import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { BackToTopButton } from "@/components/common/BackToTopButton";
import { footerLinks, navLinks, siteConfig, socialLinks } from "@/lib/site-config";

export function Footer() {
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
            <ul className="mt-4 space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  )}
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
