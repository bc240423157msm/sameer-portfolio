"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface TagInputProps {
  /** Current tags. */
  value: string[];
  /** Called with the full updated tag list whenever it changes. */
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  /** Max number of tags allowed (soft UX cap — too many focus keywords dilutes SEO value). */
  maxTags?: number;
}

/**
 * Type a keyword, press Enter (or comma) to turn it into a tag/chip.
 * Backspace on an empty input removes the last tag. Click the × to remove any tag.
 */
export function TagInput({
  value,
  onChange,
  placeholder = "Type a keyword and press Enter…",
  className,
  maxTags = 8,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const cleaned = draft.trim();
    if (!cleaned) return;
    if (value.some((t) => t.toLowerCase() === cleaned.toLowerCase())) {
      setDraft("");
      return; // no duplicate tags
    }
    if (value.length >= maxTags) {
      setDraft("");
      return;
    }
    onChange([...value, cleaned]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
      return;
    }
    if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div
      className={cn(
        "flex min-h-11 flex-wrap items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 focus-within:border-primary",
        className
      )}
    >
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            aria-label={`Remove keyword ${tag}`}
            className="rounded-full text-primary/70 transition-colors hover:text-primary"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-[140px] flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
      />
    </div>
  );
}
