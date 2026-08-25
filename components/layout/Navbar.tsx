"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import type { NavLink } from "@/types";
import { navLinks as defaultNavLinks } from "@/lib/site-config";
import { DEFAULT_LOGO, resolveImageSrc } from "@/lib/image-src";
import { cn } from "@/utils/cn";

interface NavbarProps {
  logoSrc: string;
  logoAlt: string;
  logoWidth?: number;
  navLinks?: NavLink[];
  extraNavLinks?: NavLink[];
  isAdmin?: boolean;
  /** Keep the navbar visible immediately on load, instead of only
   * revealing it once the user scrolls down. Used on pages (like the
   * portal login) where there may be no scrollable content at all. */
  alwaysVisible?: boolean;
}

interface PortalUser {
  username: string;
  avatarUrl?: string;
}

function ProfileBadge() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.authenticated) return;
        setUser({
          username: data.user?.username ?? "",
          avatarUrl: data.avatarUrl,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // Re-check on every route change too — the layout that renders the
    // Navbar persists across client-side navigations, so without this the
    // avatar picked in the portal wouldn't show up until a hard refresh.
  }, [pathname]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  if (!user) return null;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 py-1 pl-1 pr-3 text-sm font-medium text-text-primary transition-colors hover:bg-card"
        aria-label="Account menu"
        aria-expanded={menuOpen}
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.username}
            width={28}
            height={28}
            unoptimized
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            {user.username.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="hidden max-w-[120px] truncate sm:inline">{user.username}</span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <Link
            href="/portal"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2.5 text-sm text-text-primary hover:bg-background"
          >
            Portal
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-4 py-2.5 text-left text-sm text-error hover:bg-background"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar({
  logoSrc,
  logoAlt,
  logoWidth = 104,
  navLinks = defaultNavLinks,
  extraNavLinks = [],
  isAdmin = false,
  alwaysVisible = false,
}: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(alwaysVisible);
  const [currentLogoSrc, setCurrentLogoSrc] = useState(() =>
    resolveImageSrc(logoSrc, DEFAULT_LOGO)
  );
  const [syncedLogoSrc, setSyncedLogoSrc] = useState(logoSrc);

  if (logoSrc !== syncedLogoSrc) {
    setSyncedLogoSrc(logoSrc);
    setCurrentLogoSrc(resolveImageSrc(logoSrc, DEFAULT_LOGO));
  }

  const allLinks = [...navLinks, ...extraNavLinks];

  useEffect(() => {
    if (alwaysVisible) return;
    const onScroll = () => setHasScrolled(window.scrollY > 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysVisible]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-50 border-b border-border bg-background/90 shadow-lg shadow-black/5 backdrop-blur-md transition-transform duration-300 ease-out",
        isAdmin ? "top-10" : "top-0",
        hasScrolled || isOpen || alwaysVisible
          ? "translate-y-0"
          : isAdmin
            ? "-translate-y-[calc(100%+2.5rem)]"
            : "-translate-y-full"
      )}
    >
      <Container>
        <nav className="flex h-[72px] items-center justify-between gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            onClick={() => setIsOpen(false)}
            aria-label="Go to homepage"
          >
            <Image
              src={currentLogoSrc}
              alt={logoAlt}
              width={220}
              height={54}
              priority
              style={{ width: logoWidth, height: "auto", maxWidth: "min(50vw, 320px)" }}
              className="object-contain object-left"
              onError={() => {
                if (currentLogoSrc !== DEFAULT_LOGO) {
                  setCurrentLogoSrc(DEFAULT_LOGO);
                }
              }}
            />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {allLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm transition-colors",
                    isActive(link.href)
                      ? "font-medium text-text-primary"
                      : "text-text-secondary hover:bg-card hover:text-text-primary"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            {isAdmin && <ProfileBadge />}
            <Link
              href="/contact"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Hire Me
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            {isAdmin && <ProfileBadge />}
            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-primary"
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
          </div>
        </nav>
      </Container>

      {isOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden">
          <Container>
            <ul className="flex flex-col gap-1 py-4">
              {allLinks.map((link) => (
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
