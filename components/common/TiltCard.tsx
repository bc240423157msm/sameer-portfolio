"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/utils/cn";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

/**
 * Subtle 3D tilt-on-hover based on mouse position within the card.
 * Rotation capped to ±4deg by default for a tasteful effect.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 4,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = -y * maxTilt * 2;
      const rotateY = x * maxTilt * 2;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    },
    [maxTilt]
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  return (
    <div
      ref={ref}
      data-cursor="drag"
      className={cn(
        "transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
        className
      )}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
