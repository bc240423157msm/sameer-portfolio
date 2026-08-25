"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Full-screen loading overlay shown the instant the page starts rendering.
 * Fades out and unmounts itself shortly after the app has hydrated on the
 * client, so visitors see a brief spinner instead of a flash of an
 * unstyled/partial page while fonts, theme, and client components settle in.
 *
 * Renders identically on server and client on first paint (visible, not
 * fading) so there's no hydration mismatch — the fade-out only starts once
 * `useEffect` runs, which only happens after hydration completes.
 */
export function PageLoader() {
  const [mounted, setMounted] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // A short delay avoids an abrupt flash on fast connections while still
    // covering the brief window where client components/fonts settle in.
    const fadeTimer = setTimeout(() => setFading(true), 200);
    const unmountTimer = setTimeout(() => setMounted(false), 600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-5 bg-background transition-opacity duration-500 ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        {/* Soft glow pulsing behind the mark */}
        <div className="absolute inset-0 animate-[loader-pulse_1.8s_ease-in-out_infinite] rounded-full bg-primary/20 blur-lg motion-reduce:animate-none" />
        {/* Slim rotating ring */}
        <div className="absolute inset-0 animate-[loader-spin_1.1s_linear_infinite] rounded-full border-2 border-border/70 border-t-primary motion-reduce:animate-none" />
        <Image
          src="/logo.svg"
          alt=""
          width={26}
          height={26}
          priority
          className="relative opacity-90"
        />
      </div>
      <div className="h-1 w-32 overflow-hidden rounded-full bg-border/50">
        <div className="h-full w-1/3 animate-[loader-slide_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-primary to-accent motion-reduce:hidden" />
      </div>
    </div>
  );
}
