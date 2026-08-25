"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { DEFAULT_LOGO, resolveImageSrc } from "@/lib/image-src";

interface ImageSpotlightProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  onClick?: () => void;
  fallbackSrc?: string;
  /** Adds data-cursor="view" for custom cursor */
  interactive?: boolean;
}

/**
 * Image wrapper with a soft glowing border/spotlight that follows the cursor.
 * Uses CSS custom properties --x / --y for radial gradient positioning.
 */
export function ImageSpotlight({
  src,
  alt,
  fill = true,
  width,
  height,
  sizes,
  className,
  imageClassName,
  priority,
  onClick,
  fallbackSrc = DEFAULT_LOGO,
  interactive = true,
}: ImageSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const normalizedSrc = resolveImageSrc(src, fallbackSrc);
  const normalizedFallback = resolveImageSrc(fallbackSrc);
  const currentSrc =
    failedSrc === normalizedSrc ? normalizedFallback : normalizedSrc;

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
  }, []);

  const handleLeave = useCallback(() => {
    ref.current?.style.removeProperty("--x");
    ref.current?.style.removeProperty("--y");
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "group/spotlight overflow-hidden",
        fill ? "absolute inset-0" : "relative",
        onClick && "cursor-pointer",
        className
      )}
      data-cursor={interactive ? "view" : undefined}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      <Image
        src={currentSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-[transform,filter] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/spotlight:scale-[1.03] group-hover/spotlight:brightness-110",
          imageClassName
        )}
        onError={() => {
          if (currentSrc !== normalizedFallback) setFailedSrc(normalizedSrc);
        }}
      />
      {/* Spotlight glow border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/spotlight:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), color-mix(in srgb, var(--color-primary) 25%, transparent), transparent 40%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/spotlight:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 40%, transparent), 0 0 30px -5px color-mix(in srgb, var(--color-primary) 30%, transparent)`,
          background: `radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), color-mix(in srgb, var(--color-primary) 15%, transparent), transparent 50%)`,
        }}
      />
    </div>
  );
}
