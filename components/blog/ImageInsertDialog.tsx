"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ImageInsertDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, alt: string) => void;
}

export function ImageInsertDialog({
  open,
  onClose,
  onInsert,
}: ImageInsertDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [dragOver, setDragOver] = useState(false);

  if (!open) return null;

  async function uploadFile(file: File) {
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
      setPreviewUrl(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) uploadFile(file);
  }

  function handleInsert() {
    if (!previewUrl) {
      setError("Upload an image first.");
      return;
    }
    if (!alt.trim()) {
      setError("Alt text is required for accessibility and SEO.");
      return;
    }
    onInsert(previewUrl, alt.trim());
    setPreviewUrl("");
    setAlt("");
    setError("");
  }

  function handleClose() {
    setPreviewUrl("");
    setAlt("");
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[10003] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Insert image</h3>
          <button
            type="button"
            onClick={handleClose}
            className="rounded p-1 text-text-muted hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "relative flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-border bg-surface"
          )}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              sizes="400px"
              className="rounded-xl object-cover"
            />
          ) : (
            <>
              <Upload className="h-8 w-8 text-text-muted" />
              <p className="mt-2 text-sm text-text-secondary">
                Drag & drop or click to upload
              </p>
            </>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/70">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = "";
          }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-3 w-full rounded-lg border border-border py-2 text-sm text-text-secondary hover:border-primary/40"
        >
          Choose file
        </button>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-text-primary">
            Alt text <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the image for screen readers and SEO"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
            required
          />
        </div>

        {error && <p className="mt-2 text-xs text-error">{error}</p>}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={handleInsert}
            disabled={!previewUrl || !alt.trim()}
            className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Insert into content
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
