"use client";

import { useCallback, useState } from "react";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/common/MotionReveal";
import { TestimonialCard } from "@/components/sections/TestimonialCard";
import type { Testimonial } from "@/types/content";

const STICKERS = ["❤️", "🥰", "💖", "😍", "💕"];

interface TestimonialsGridProps {
  testimonials: Testimonial[];
  likes: Record<string, number>;
}

interface FloatingHeart {
  id: number;
  left: number;
  emoji: string;
  delay: number;
  rotate: number;
}

/** A once-off, full-screen "bohot pyar" moment: a big sticker pops in the
 * middle of the screen with a handful of smaller hearts floating up around
 * it, then fades out on its own after ~1.4s. */
function LoveBurstOverlay({ show }: { show: boolean }) {
  const [hearts] = useState<FloatingHeart[]>(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      emoji: STICKERS[Math.floor(Math.random() * STICKERS.length)]!,
      delay: Math.random() * 300,
      rotate: (Math.random() - 0.5) * 40,
    }))
  );

  if (!show) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
      aria-hidden
    >
      <span
        className="absolute left-1/2 top-1/2 text-[7rem] drop-shadow-lg sm:text-[9rem]"
        style={{ animation: "loveBurstIn 1.1s cubic-bezier(0.16,1,0.3,1) forwards" }}
      >
        🥰
      </span>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-0 text-2xl sm:text-3xl"
          style={{
            left: `${h.left}%`,
            ["--rot" as string]: `${h.rotate}deg`,
            animation: `loveFloatUp 1.4s ease-out ${h.delay}ms forwards`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

export function TestimonialsGrid({ testimonials, likes }: TestimonialsGridProps) {
  const [burstTick, setBurstTick] = useState(0);
  const [showBurst, setShowBurst] = useState(false);

  const triggerBurst = useCallback(() => {
    setBurstTick((n) => n + 1);
    setShowBurst(true);
    window.setTimeout(() => setShowBurst(false), 1500);
  }, []);

  return (
    <>
      <LoveBurstOverlay key={burstTick} show={showBurst} />
      <StaggerContainer className="mt-16 grid gap-6 md:grid-cols-3">
        {testimonials.map((item) => (
          <StaggerItem key={item.id}>
            <TestimonialCard
              item={item}
              initialLikes={likes[item.id] ?? 0}
              onLoveBurst={triggerBurst}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </>
  );
}
