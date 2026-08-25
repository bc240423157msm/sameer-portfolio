"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorIndex: number;
}

// Brand palette pulled from app/globals.css @theme tokens.
const PARTICLE_COLORS = [
  "16, 185, 129", // --color-primary (emerald)
  "52, 211, 153", // --color-secondary (teal)
  "251, 191, 36", // --color-accent (gold)
];

const MAX_PARTICLES_DESKTOP = 90;
const MAX_PARTICLES_MOBILE = 28;
const LINK_DISTANCE = 130;
const MOBILE_BREAKPOINT = 768;

interface AnimatedHeaderBackgroundProps {
  className?: string;
}

/**
 * Bold, eye-catching animated header background: a constellation of floating
 * particles connected by lines, plus slow-drifting blurred gradient shapes.
 * Pure canvas + CSS — no network requests, so it paints instantly (unlike
 * the photo headers, which depend on fetching a remote image).
 */
export function AnimatedHeaderBackground({
  className,
}: AnimatedHeaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let running = true;
    let isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    function resize() {
      const canvasEl = canvasRef.current;
      const parent = canvasEl?.parentElement;
      if (!canvasEl || !ctx || !parent) return;
      isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      // Cap DPR at 1 on mobile — rendering at 2x pixel density on a busy
      // particle canvas is a common cause of jank on mid/low-end phones.
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvasEl.width = width * dpr;
      canvasEl.height = height * dpr;
      canvasEl.style.width = `${width}px`;
      canvasEl.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const maxParticles = isMobile ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP;
      const count = Math.min(
        maxParticles,
        Math.round((width * height) / (isMobile ? 22000 : 14000))
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 1,
        colorIndex: Math.floor(Math.random() * PARTICLE_COLORS.length),
      }));
    }

    function drawStaticFrame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLORS[p.colorIndex]}, 0.6)`;
        ctx.fill();
      }
    }

    function tick() {
      if (!ctx || !running) return;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;
      }

      // The pairwise distance check below is O(n^2) — with fewer mobile
      // particles it's cheap, but the line-drawing itself (separate stroke
      // calls) is still the priciest part of the frame on phone GPUs, so we
      // skip it there entirely and just show the dots.
      if (!isMobile) {
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i]!;
          for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j]!;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist < LINK_DISTANCE) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(16, 185, 129, ${0.18 * (1 - dist / LINK_DISTANCE)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLORS[p.colorIndex]}, 0.75)`;
        ctx.fill();
      }

      animationFrame = requestAnimationFrame(tick);
    }

    resize();
    if (prefersReducedMotion) {
      drawStaticFrame();
    } else {
      animationFrame = requestAnimationFrame(tick);
    }

    function handleVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animationFrame);
      } else if (!prefersReducedMotion) {
        running = true;
        animationFrame = requestAnimationFrame(tick);
      }
    }

    let resizeTimeout: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        if (prefersReducedMotion) drawStaticFrame();
      }, 200);
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className={className} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_color-mix(in_srgb,var(--color-primary)_14%,transparent),transparent_65%)]" />

      <motion.div
        className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary/20 blur-[60px] md:blur-[110px]"
        animate={{ opacity: [0.3, 0.6, 0.3], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-16 top-0 h-80 w-80 rounded-full bg-accent/15 blur-[65px] md:blur-[120px]"
        animate={{ opacity: [0.25, 0.55, 0.25], x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      {/* Third blob is desktop-only — three simultaneous large-blur, infinitely
          animating layers is the main cause of mobile jank; two lighter ones
          keep the effect without the cost. */}
      <motion.div
        className="absolute bottom-0 left-1/3 hidden h-64 w-64 rounded-full bg-secondary/15 blur-[100px] md:block"
        animate={{ opacity: [0.2, 0.5, 0.2], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
