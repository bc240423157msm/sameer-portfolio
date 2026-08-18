"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard } from "@/components/sections/TestimonialCard";
import type { Testimonial } from "@/types/content";

const STICKERS = ["❤️", "🥰", "💖", "😍", "💕"];
const PAGE_SIZE = 3;

interface TestimonialsGridProps {
  testimonials: Testimonial[];
  likes: Record<string, number>;
  /** Seconds between automatic slides, set from Admin → Testimonials. */
  autoScrollSeconds?: number;
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

export function TestimonialsGrid({
  testimonials,
  likes,
  autoScrollSeconds = 6,
}: TestimonialsGridProps) {
  const [burstTick, setBurstTick] = useState(0);
  const [showBurst, setShowBurst] = useState(false);

  const triggerBurst = useCallback(() => {
    setBurstTick((n) => n + 1);
    setShowBurst(true);
    window.setTimeout(() => setShowBurst(false), 1500);
  }, []);

  // Split testimonials into pages of exactly PAGE_SIZE (3) so only 3 ever
  // show at once — the rest live on the next page(s) and rotate in.
  const pages = useMemo(() => {
    const chunks: Testimonial[][] = [];
    for (let i = 0; i < testimonials.length; i += PAGE_SIZE) {
      chunks.push(testimonials.slice(i, i + PAGE_SIZE));
    }
    return chunks;
  }, [testimonials]);

  const pageCount = pages.length;
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number, dir: number) => {
      if (pageCount <= 1) return;
      setDirection(dir);
      setPageIndex(((index % pageCount) + pageCount) % pageCount);
    },
    [pageCount]
  );

  const goNext = useCallback(() => goTo(pageIndex + 1, 1), [goTo, pageIndex]);
  const goPrev = useCallback(() => goTo(pageIndex - 1, -1), [goTo, pageIndex]);

  // Auto-scroll: only kicks in when there's more than one page (more than
  // 3 reviews). Pauses on hover so people can actually read a card, and
  // resets whenever the interval length or page count changes.
  useEffect(() => {
    if (pageCount <= 1 || isPaused) return;
    const ms = Math.max(2, autoScrollSeconds) * 1000;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setPageIndex((prev) => (prev + 1) % pageCount);
    }, ms);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pageCount, isPaused, autoScrollSeconds]);

  const currentPage = pages[pageIndex] ?? [];

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <>
      <LoveBurstOverlay key={burstTick} show={showBurst} />

      <div
        className="relative mt-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={pageIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="grid gap-6 md:grid-cols-3"
            >
              {currentPage.map((item) => (
                <TestimonialCard
                  key={item.id}
                  item={item}
                  initialLikes={likes[item.id] ?? 0}
                  onLoveBurst={triggerBurst}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {pageCount > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/50 text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i, i > pageIndex ? 1 : -1)}
                  aria-label={`Go to reviews page ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === pageIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-border hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/50 text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
