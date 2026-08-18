"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * Safety net: whileInView relies on an IntersectionObserver being set up
 * and firing correctly. In some cases (elements already in the viewport
 * on load, slow JS hydration, etc.) that never happens, which would leave
 * content stuck at opacity:0 forever. This hook forces the "visible" state
 * after a short timeout so nothing stays permanently hidden.
 */
function useRevealFallback(delayMs = 700) {
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setForceVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return forceVisible;
}

interface MotionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

const directionOffset = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: MotionRevealProps) {
  const offset = directionOffset[direction];
  const forceVisible = useRevealFallback();

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate={forceVisible ? "visible" : undefined}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.1,
}: StaggerContainerProps) {
  const forceVisible = useRevealFallback();

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate={forceVisible ? "visible" : undefined}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
