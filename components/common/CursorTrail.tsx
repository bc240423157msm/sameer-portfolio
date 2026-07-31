"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type CursorMode = "default" | "view" | "drag" | "button";

/**
 * Custom cursor: a small solid dot with a bigger, softer ring trailing
 * behind it (the ring lags more, giving a nice "chasing" feel). Mode
 * switches when hovering images (view), tilt cards (drag), and any
 * clickable element (button — shows a small hand glyph in the ring).
 */
export function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const modeRef = useRef<CursorMode>("default");

  const [mode, setMode] = useState<CursorMode>("default");
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const updateMode = useCallback((target: EventTarget | null) => {
    if (!(target instanceof Element)) {
      setMode("default");
      return;
    }
    const explicit = target.closest("[data-cursor]");
    if (explicit) {
      setMode((explicit.getAttribute("data-cursor") as CursorMode) ?? "default");
      return;
    }
    // No explicit mode set — still give clickable elements their own feel
    // (a hand icon in the ring) so the cursor reacts to *every*
    // button/link, not just the ones that were manually tagged.
    const clickable = target.closest(
      "a, button, [role='button'], summary, input[type='submit'], input[type='button'], label[for]"
    );
    setMode(clickable ? "button" : "default");
  }, []);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isTouch || reducedMotion) return;

    // Hide the native OS cursor everywhere so our cursor is the only one
    // the visitor sees. Only added once we know it will actually render
    // (skipped above for touch / reduced-motion), so we never hide the
    // cursor with nothing to replace it.
    document.documentElement.classList.add("custom-cursor-active");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let visible = false;
    let rafId = 0;

    function handleMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      updateMode(e.target);
      if (!visible) {
        visible = true;
        dot!.style.opacity = "1";
        ring!.style.opacity = "1";
        if (label) label.style.opacity = "1";
      }
    }

    function handleLeave() {
      visible = false;
      dot!.style.opacity = "0";
      ring!.style.opacity = "0";
      if (label) label.style.opacity = "0";
    }

    function dotSizeFor(m: CursorMode) {
      return m === "view" ? 10 : m === "button" ? 7 : m === "drag" ? 9 : 7;
    }
    function ringSizeFor(m: CursorMode) {
      return m === "view" ? 46 : m === "button" ? 36 : m === "drag" ? 30 : 26;
    }

    function handleDown() {
      const m = modeRef.current;
      const size = ringSizeFor(m) * 0.85;
      ring!.style.width = `${size}px`;
      ring!.style.height = `${size}px`;
    }
    function handleUp() {
      const size = ringSizeFor(modeRef.current);
      ring!.style.width = `${size}px`;
      ring!.style.height = `${size}px`;
    }

    function tick() {
      // The dot tracks the mouse tightly; the ring lags further behind,
      // so it visibly trails/chases the dot as you move.
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      const m = modeRef.current;
      const dSize = dotSizeFor(m);
      const rSize = ringSizeFor(m);

      dot!.style.width = `${dSize}px`;
      dot!.style.height = `${dSize}px`;
      dot!.style.transform = `translate(${dotX - dSize / 2}px, ${dotY - dSize / 2}px)`;

      ring!.style.width = `${rSize}px`;
      ring!.style.height = `${rSize}px`;
      ring!.style.transform = `translate(${ringX - rSize / 2}px, ${ringY - rSize / 2}px)`;

      if (label) {
        label.style.transform = `translate(${mouseX + 20}px, ${mouseY - 10}px)`;
      }

      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      cancelAnimationFrame(rafId);
    };
  }, [updateMode]);

  const labelText = mode === "view" ? "View" : mode === "drag" ? "Drag" : "";

  // "button" mode intentionally reuses the normal/default color — hovering
  // a link shouldn't change the cursor's color, just add the hand glyph.
  const modeColor =
    mode === "view"
      ? "var(--color-accent)"
      : mode === "drag"
        ? "var(--color-violet)"
        : "var(--color-primary)";

  return (
    <>
      {/* Small solid dot — the tight, fast-tracking core of the cursor. */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full opacity-0 transition-[background,box-shadow] duration-200 ease-out"
        style={{
          background: modeColor,
          boxShadow: `0 0 8px 1px color-mix(in srgb, ${modeColor} 60%, transparent)`,
          willChange: "transform, width, height",
        }}
      />

      {/* Soft ring that trails further behind the dot. */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border opacity-0 transition-[border-color,background] duration-200 ease-out"
        style={{
          borderColor: `color-mix(in srgb, ${modeColor} 55%, transparent)`,
          background: `color-mix(in srgb, ${modeColor} 10%, transparent)`,
          willChange: "transform, width, height",
        }}
      >
        {/* Small hand/pointer glyph shown whenever the cursor is over
            anything clickable — the literal "hand" indicator. */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="transition-opacity duration-150"
          style={{
            width: "50%",
            height: "50%",
            opacity: mode === "button" ? 1 : 0,
            color: "var(--color-text-primary)",
          }}
        >
          <path
            d="M9 12.5V6.2a1.3 1.3 0 1 1 2.6 0v4.8M11.6 10.6V4.9a1.3 1.3 0 1 1 2.6 0v5.7M14.2 10.8V6.3a1.3 1.3 0 1 1 2.6 0v7.4M9 12.3l-1.4-1.3a1.4 1.4 0 0 0-2 2l3.6 4.2c.8.9 2 1.5 3.2 1.5h1.8c2.2 0 4-1.8 4-4V9.1a1.3 1.3 0 1 0-2.6 0"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {labelText && (
        <span
          ref={labelRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[9999] rounded bg-card/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary opacity-0 backdrop-blur-sm"
          style={{ willChange: "transform" }}
        >
          {labelText}
        </span>
      )}
    </>
  );
}
