"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { Testimonial } from "@/types/content";

interface TestimonialCardProps {
  item: Testimonial;
  initialLikes: number;
  /** Called right when a like (not an unlike) happens, so a parent can show a
   * full-screen love-sticker moment. */
  onLoveBurst?: () => void;
}

function HeartParticles({ active }: { active: boolean }) {
  const [offsets] = useState(() =>
    Array.from({ length: 6 }, () => ({
      tx: (Math.random() - 0.5) * 60,
      ty: -20 - Math.random() * 40,
    }))
  );

  if (!active) return null;
  return (
    <div className="pointer-events-none absolute bottom-8 right-4" aria-hidden>
      {offsets.map((offset, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 animate-[particle_0.6s_ease-out_forwards] rounded-full bg-error"
          style={{
            animationDelay: `${i * 40}ms`,
            ["--tx" as string]: `${offset.tx}px`,
            ["--ty" as string]: `${offset.ty}px`,
          }}
        />
      ))}
    </div>
  );
}

export function TestimonialCard({ item, initialLikes, onLoveBurst }: TestimonialCardProps) {
  const { success, error } = useToast();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [popping, setPopping] = useState(false);
  const [particles, setParticles] = useState(false);
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch(`/api/testimonials/like?testimonialId=${item.id}`)
      .then((r) => r.json())
      .then((data: { liked?: boolean; count?: number }) => {
        if (typeof data.count === "number") setLikes(data.count);
        if (data.liked) setLiked(true);
      })
      .catch(() => {});
  }, [item.id]);

  const burstParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 80;
    canvas.height = 80;
    const particles = Array.from({ length: 12 }, () => ({
      x: 40,
      y: 40,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 2,
      life: 1,
      color: ["#ef4444", "#fbbf24", "#10b981", "#8b5cf6"][
        Math.floor(Math.random() * 4)
      ]!,
    }));

    let frame: number;
    function draw() {
      ctx!.clearRect(0, 0, 80, 80);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life -= 0.03;
        ctx!.globalAlpha = p.life;
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx!.fill();
      }
      if (alive) frame = requestAnimationFrame(draw);
      else ctx!.clearRect(0, 0, 80, 80);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  async function handleLike() {
    if (busy) return;
    setBusy(true);
    const wasLiked = liked;

    setPopping(true);
    if (!wasLiked) {
      setParticles(true);
      burstParticles();
      onLoveBurst?.();
    }
    setTimeout(() => {
      setPopping(false);
      setParticles(false);
    }, 600);

    try {
      const res = await fetch("/api/testimonials/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId: item.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        error(data.error ?? "Could not update your like");
        return;
      }

      setLikes(data.count);
      setLiked(data.liked);
      if (data.liked) success("Thanks for the love!");
    } catch {
      error("Connection error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <blockquote className="relative flex flex-col rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm">
      <div className="mb-4 flex gap-1" aria-label={`${item.rating} out of 5 stars`}>
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-accent text-accent" aria-hidden />
        ))}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-text-secondary">
        &ldquo;{item.quote}&rdquo;
      </p>
      <footer className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
        {item.image ? (
          <div
            className="group/avatar relative h-10 w-10 shrink-0 overflow-hidden rounded-full"
            data-cursor="view"
          >
            <Image
              src={item.image}
              alt={item.author}
              width={40}
              height={40}
              className="h-10 w-10 object-cover transition-[transform,filter] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/avatar:scale-[1.03] group-hover/avatar:brightness-110"
            />
          </div>
        ) : (
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
            aria-hidden
          >
            {item.author.trim().charAt(0).toUpperCase() || "?"}
          </span>
        )}
        <cite className="not-italic">
          <p className="text-sm font-medium text-text-primary">{item.author}</p>
          <p className="text-xs text-text-muted">{item.role}</p>
        </cite>
      </footer>

      <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute -right-2 -top-8"
          aria-hidden
        />
        <HeartParticles active={particles} />
        <button
          type="button"
          onClick={handleLike}
          disabled={busy}
          aria-label={liked ? "Remove your like" : "Like this testimonial"}
          title={liked ? "Click to remove your like" : "Like this testimonial"}
          className="group/heart flex items-center gap-1 rounded-full p-1.5 transition-colors hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Heart
            className={`h-4 w-4 transition-all duration-300 ${
              liked
                ? "fill-error text-error"
                : "text-text-muted group-hover/heart:text-error"
            } ${popping ? "animate-[heartPop_0.4s_ease-out]" : ""}`}
          />
          {likes > 0 && (
            <span className="text-xs font-medium text-text-muted">{likes}</span>
          )}
        </button>
      </div>
    </blockquote>
  );
}
