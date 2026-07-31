"use client";

import Image from "next/image";
import { forwardRef } from "react";

interface SpotlightRevealProps {
  src: string;
  alt: string;
  /** Radius of the visible circle in pixels. */
  radius?: number;
}

/**
 * A decorative image layer that stays hidden and is only revealed inside a
 * small circle that follows the visitor's cursor — like a spotlight/torch.
 * Mouse position is written to CSS custom properties (--spot-x / --spot-y)
 * on the nearest positioned ancestor, so this component itself never needs
 * to catch pointer events (keeps buttons/links above it fully clickable).
 */
export const SpotlightReveal = forwardRef<HTMLDivElement, SpotlightRevealProps>(
  function SpotlightReveal({ src, alt, radius = 180 }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 [.spotlight-active_&]:opacity-80"
        style={{
          WebkitMaskImage: `radial-gradient(${radius}px circle at var(--spot-x, 50%) var(--spot-y, 50%), black 0%, black 40%, transparent 75%)`,
          maskImage: `radial-gradient(${radius}px circle at var(--spot-x, 50%) var(--spot-y, 50%), black 0%, black 40%, transparent 75%)`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    );
  }
);

/** Attach to the onMouseMove / onMouseLeave of the positioned parent. */
export function useSpotlightHandlers(ref: React.RefObject<HTMLElement | null>) {
  return {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--spot-x", `${x}%`);
      el.style.setProperty("--spot-y", `${y}%`);
      el.classList.add("spotlight-active");
    },
    onMouseLeave: () => {
      ref.current?.classList.remove("spotlight-active");
    },
  };
}
