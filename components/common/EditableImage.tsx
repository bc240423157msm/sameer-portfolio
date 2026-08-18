"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Camera } from "lucide-react";
import { useEditMode } from "@/components/portal/AdminToolbar";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/utils/cn";
import { isLocalPublicImage, resolveImageSrc } from "@/lib/image-src";

// ImageUploader (drag-drop handling, upload API calls, preview UI) is only
// ever needed by a logged-in admin who opens the picker — regular visitors
// should never pay for its JS. Loading it on demand keeps it out of the
// bundle everyone else downloads.
const ImageUploader = dynamic(() =>
  import("@/components/portal/ImageUploader").then((m) => ({
    default: m.ImageUploader,
  }))
);

interface EditableImageProps {
  contentPath: string;
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  /** Shown if `src` fails to load (e.g. a removed/renamed file). */
  fallbackSrc?: string;
}

export function EditableImage({
  contentPath,
  src,
  alt,
  className,
  fill = true,
  sizes,
  width,
  height,
  fallbackSrc,
}: EditableImageProps) {
  const editMode = useEditMode();
  const { success, error } = useToast();
  const resolvedSrc = resolveImageSrc(src, fallbackSrc);
  const resolvedFallback = fallbackSrc ? resolveImageSrc(fallbackSrc) : undefined;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc || resolvedFallback || "");
  const [didFallback, setDidFallback] = useState(false);
  // Tracks the `src` this state was last synced to, so we can tell whether
  // the prop changed since the last render (see below).
  const [syncedSrc, setSyncedSrc] = useState(src);

  // `src` can change after this component has already mounted — e.g. the
  // section's content is edited, a different item is loaded into the same
  // slot, or the site content refreshes from the server. Without this, the
  // image would keep showing whatever was passed in on the very first
  // render, ignoring any later section/content change. This "adjusting
  // state during render" pattern (rather than an effect) avoids an extra
  // render pass — see https://react.dev/learn/you-might-not-need-an-effect
  if (src !== syncedSrc) {
    setSyncedSrc(src);
    setCurrentSrc(resolvedSrc || resolvedFallback || "");
    setDidFallback(false);
  }

  const saveImage = useCallback(
    async (url: string) => {
      setCurrentSrc(url);
      try {
        const res = await fetch(
          `/api/content/${encodeURIComponent(contentPath)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: url }),
          }
        );
        if (!res.ok) {
          const data = await res.json();
          error(data.error ?? "Failed to save image");
          return;
        }
        success("Image saved ✓");
        setPickerOpen(false);
      } catch {
        error("Connection error");
      }
    },
    [contentPath, success, error]
  );

  return (
    <div
      className={cn(
        fill ? "absolute inset-0" : "relative inline-block",
        className
      )}
    >
      {currentSrc ? (
        <Image
          src={currentSrc}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          unoptimized={isLocalPublicImage(currentSrc)}
          className="object-cover"
          data-cursor="view"
          onError={() => {
            if (resolvedFallback && !didFallback) {
              setDidFallback(true);
              setCurrentSrc(resolvedFallback);
            } else {
              setCurrentSrc("");
            }
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-card/60 text-xs text-text-secondary">
          No image
        </div>
      )}
      {editMode && (
        <>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-lg border border-border/60 bg-card/90 px-2 py-1 text-xs font-medium text-text-primary backdrop-blur-sm"
          >
            <Camera className="h-3.5 w-3.5" />
            Edit
          </button>
          {pickerOpen && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4">
                <ImageUploader
                  label="Replace image"
                  value={currentSrc}
                  onChange={saveImage}
                  enableDragDrop
                />
                <button
                  type="button"
                  onClick={() => setPickerOpen(false)}
                  className="mt-3 w-full rounded-lg border border-border py-2 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
