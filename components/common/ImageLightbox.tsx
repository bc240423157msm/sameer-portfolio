"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageLightboxProps) {
  const hasMultiple = images.length > 1;

  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasMultiple) goPrev();
      if (e.key === "ArrowRight" && hasMultiple) goNext();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext, hasMultiple]);

  const current = images[currentIndex];
  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[10001] flex items-center justify-center"
        role="dialog"
        aria-modal
        aria-label="Image preview"
      >
        <button
          type="button"
          className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          onClick={onClose}
          aria-label="Close lightbox"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-4 max-h-[90vh] max-w-5xl"
        >
          <Image
            src={current.src}
            alt={current.alt}
            width={1200}
            height={800}
            className="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
            priority
          />
        </motion.div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full border border-border/60 bg-card/80 p-2 text-text-primary backdrop-blur-sm transition-colors hover:bg-card"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border/60 bg-card/80 p-2 text-text-primary backdrop-blur-sm transition-colors hover:bg-card"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border/60 bg-card/80 p-2 text-text-primary backdrop-blur-sm transition-colors hover:bg-card"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <p className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-card/80 px-3 py-1 text-xs text-text-secondary backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </p>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
