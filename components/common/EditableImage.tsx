"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Camera } from "lucide-react";
import { useEditMode } from "@/components/portal/AdminToolbar";
import { useToast } from "@/components/ui/Toast";
import { ImageUploader } from "@/components/portal/ImageUploader";
import { cn } from "@/utils/cn";

interface EditableImageProps {
  contentPath: string;
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
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
}: EditableImageProps) {
  const editMode = useEditMode();
  const { success, error } = useToast();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

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
    <div className={cn("relative", className)}>
      <Image
        src={currentSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        className="object-cover"
        data-cursor="view"
      />
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
