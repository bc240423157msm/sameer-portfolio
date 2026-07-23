"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { navLinks } from "@/lib/site-config";
import { cn } from "@/utils/cn";

interface NavbarProps {
  logoSrc: string;
  logoAlt: string;
}

export function Navbar({ logoSrc, logoAlt }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            onClick={() => setIsOpen(false)}
            aria-label="Go to homepage"
          >
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={220}
              height={54}
              priority
              className="h-11 w-auto max-w-[220px] object-contain object-left sm:h-12 sm:max-w-[240px]"
            />
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors hover:text-text-primary",
                    isActive(link.href)
                      ? "font-medium text-text-primary"
                      : "text-text-secondary"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Link
              href="/contact"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Hire Me
            </Link>
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-primary md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="flex h-4 w-5 flex-col justify-between">
              <span
                className={cn(
                  "h-0.5 w-full bg-current transition-transform",
                  isOpen && "translate-y-[7px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-full bg-current transition-opacity",
                  isOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-full bg-current transition-transform",
                  isOpen && "-translate-y-[7px] -rotate-45"
                )}
              />
            </div>
          </button>
        </nav>
      </Container>

      {isOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden">
          <Container>
            <ul className="flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive(link.href)
                        ? "bg-card font-medium text-text-primary"
                        : "text-text-secondary hover:bg-card"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-white"
                >
                  Hire Me
                </Link>
              </li>
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}
