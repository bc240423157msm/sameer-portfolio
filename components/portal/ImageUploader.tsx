"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, RefreshCw } from "lucide-react";
import { cn } from "@/utils/cn";
import { isLocalPublicImage, resolveImageSrc } from "@/lib/image-src";

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  /** Aspect ratio class for the preview box, e.g. "aspect-video" or "aspect-square". */
  aspect?: string;
  className?: string;
  enableDragDrop?: boolean;
}

export function ImageUploader({
  label,
  value,
  onChange,
  aspect = "aspect-video",
  className,
  enableDragDrop = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      if (data.blobConfigured === false) setStorageWarning(true);

      const previous = value;
      if (previous && previous.startsWith("/uploads/")) {
        fetch(`/api/upload?path=${encodeURIComponent(previous)}`, {
          method: "DELETE",
        }).catch(() => {});
      }

      onChange(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    if (!enableDragDrop) return;
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  async function handleRemove() {
    if (value.startsWith("/uploads/")) {
      fetch(`/api/upload?path=${encodeURIComponent(value)}`, {
        method: "DELETE",
      }).catch(() => {});
    }
    onChange("");
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm text-text-secondary">{label}</label>
      )}

      <div
        onDragOver={
          enableDragDrop
            ? (e) => {
                e.preventDefault();
                setDragOver(true);
              }
            : undefined
        }
        onDragLeave={enableDragDrop ? () => setDragOver(false) : undefined}
        onDrop={enableDragDrop ? handleDrop : undefined}
        onClick={enableDragDrop ? () => inputRef.current?.click() : undefined}
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-dashed bg-surface transition-colors",
          aspect,
          enableDragDrop && "cursor-pointer",
          dragOver ? "border-primary bg-primary/5" : "border-border"
        )}
      >
        {value ? (
          <Image
            src={value}
            alt=""
            fill
            sizes="400px"
            className="object-cover"
            unoptimized={value.startsWith("data:")}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 text-text-muted">
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs">
              {enableDragDrop ? "Drag & drop or click to upload" : "No image yet"}
            </span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-text-primary disabled:opacity-60"
        >
          {value ? (
            <>
              <RefreshCw className="h-3.5 w-3.5" /> Replace
            </>
          ) : (
            <>
              <ImagePlus className="h-3.5 w-3.5" /> Upload
            </>
          )}
        </button>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-error transition-colors hover:border-error/40 disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        )}
      </div>

      {error && <p className="text-xs text-error">{error}</p>}
      {storageWarning && (
        <p className="text-xs text-amber-500">
          ⚠️ Persistent image storage isn&apos;t connected yet — this image
          will disappear on the next deploy. Ask your developer to connect
          Vercel Blob storage (see SETUP-GUIDE-URDU.md).
        </p>
      )}
    </div>
  );
}
