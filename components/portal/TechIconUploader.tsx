"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { TechIcon } from "@/components/ui/TechIcon";
import { cn } from "@/utils/cn";

interface TechIconUploaderProps {
  /** Built-in icon slug (used only when no custom iconUrl is set). */
  slug: string;
  /** Custom uploaded logo URL, if any. */
  iconUrl?: string;
  onChange: (iconUrl: string | undefined) => void;
}

/**
 * Small square icon uploader for a single "Technologies I Use" item.
 * Lets the admin upload a logo (SVG/PNG/WEBP) for any technology that
 * doesn't already have hand-drawn artwork in TechIcon.tsx — e.g. a brand
 * new tool that was just added. Uploaded icons always win over the
 * built-in slug icon on the live site.
 */
export function TechIconUploader({ slug, iconUrl, onChange }: TechIconUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

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

      if (iconUrl?.startsWith("/uploads/")) {
        fetch(`/api/upload?path=${encodeURIComponent(iconUrl)}`, {
          method: "DELETE",
        }).catch(() => {});
      }

      onChange(data.url);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    if (iconUrl?.startsWith("/uploads/")) {
      fetch(`/api/upload?path=${encodeURIComponent(iconUrl)}`, {
        method: "DELETE",
      }).catch(() => {});
    }
    onChange(undefined);
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        title="Upload a custom logo for this technology"
        className={cn(
          "group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-background transition-colors hover:border-primary/50",
          uploading && "pointer-events-none"
        )}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <>
            <TechIcon slug={slug} iconUrl={iconUrl} className="h-8 w-8" />
            <span className="absolute inset-0 hidden items-center justify-center bg-background/80 group-hover:flex">
              <ImagePlus className="h-4 w-4 text-text-secondary" />
            </span>
          </>
        )}
      </button>

      {iconUrl && (
        <button
          type="button"
          onClick={handleRemove}
          className="flex items-center gap-0.5 text-[10px] text-text-muted hover:text-error"
        >
          <X className="h-2.5 w-2.5" /> Custom
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />
      {error && <p className="max-w-14 text-center text-[9px] text-error">{error}</p>}
    </div>
  );
}
