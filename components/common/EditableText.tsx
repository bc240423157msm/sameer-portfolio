"use client";

import { useCallback, useRef, useState } from "react";
import { useEditMode } from "@/components/portal/AdminToolbar";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/utils/cn";

interface EditableTextProps {
  /** Dot-path ID like "hero.title" */
  contentPath: string;
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}

export function EditableText({
  contentPath,
  children,
  className,
  as: Tag = "span",
}: EditableTextProps) {
  const editMode = useEditMode();
  const { success, error } = useToast();
  const ref = useRef<HTMLElement>(null);
  const [saving, setSaving] = useState(false);

  const save = useCallback(async () => {
    const el = ref.current;
    if (!el) return;
    const value = el.textContent?.trim() ?? "";

    setSaving(true);
    try {
      const res = await fetch(
        `/api/content/${encodeURIComponent(contentPath)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        error(data.error ?? "Failed to save");
        return;
      }
      success("Saved ✓");
      window.dispatchEvent(new Event("content-dirty"));
    } catch {
      error("Connection error");
    } finally {
      setSaving(false);
    }
  }, [contentPath, success, error]);

  if (!editMode) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      contentEditable
      suppressContentEditableWarning
      onBlur={save}
      className={cn(
        className,
        "outline-none transition-shadow hover:outline hover:outline-dashed hover:outline-primary/50 focus:outline focus:outline-dashed focus:outline-primary",
        saving && "opacity-60"
      )}
      data-content-path={contentPath}
    >
      {children}
    </Tag>
  );
}
