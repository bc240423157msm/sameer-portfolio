"use client";

import { createElement, useCallback, useState } from "react";
import { Pencil } from "lucide-react";
import { useEditMode } from "@/components/portal/AdminToolbar";
import { useToast } from "@/components/ui/Toast";
import { ICON_OPTIONS, getIcon } from "@/lib/icon-registry";
import { cn } from "@/utils/cn";

interface EditableIconProps {
  /** content-path pointing at the iconKey string, e.g.
   * "home.servicesPreview.items.0.iconKey" */
  contentPath: string;
  iconKey: string;
  /** Classes for the colored badge that wraps the icon (size, bg, rounding —
   * matches whatever badge each section already used around its <Icon />). */
  wrapperClassName?: string;
  /** Classes for the icon glyph itself, e.g. "h-6 w-6". */
  iconClassName?: string;
}

/** Looks up and renders a single registry icon via createElement rather
 * than JSX (`<Icon />`) — the icon component is only known at runtime
 * (looked up by key), and static analysis can't verify a dynamically
 * resolved JSX tag stays referentially stable across renders. createElement
 * sidesteps that without pretending this is a fixed component type. */
function IconGlyph({
  iconKey,
  className,
}: {
  iconKey: string;
  className?: string;
}) {
  return createElement(getIcon(iconKey), { className });
}

/** Same inline-edit pattern as EditableText/EditableImage: renders the icon
 * badge normally, and in edit mode overlays a small pencil button that opens
 * a grid picker from the fixed ICON_REGISTRY. Used identically across every
 * homepage card section (Services, Why Choose Me, About highlights) so the
 * icon-change control looks and behaves the same everywhere. */
export function EditableIcon({
  contentPath,
  iconKey,
  wrapperClassName,
  iconClassName,
}: EditableIconProps) {
  const editMode = useEditMode();
  const { success, error } = useToast();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState(iconKey);

  const saveIcon = useCallback(
    async (key: string) => {
      const previous = currentKey;
      setCurrentKey(key);
      setPickerOpen(false);
      try {
        const res = await fetch(
          `/api/content/${encodeURIComponent(contentPath)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: key }),
          }
        );
        if (!res.ok) {
          const data = await res.json();
          setCurrentKey(previous);
          error(data.error ?? "Failed to save icon");
          return;
        }
        success("Icon saved ✓");
      } catch {
        setCurrentKey(previous);
        error("Connection error");
      }
    },
    [contentPath, currentKey, success, error]
  );

  return (
    <div className={cn("relative inline-flex shrink-0", wrapperClassName)}>
      <IconGlyph iconKey={currentKey} className={iconClassName} />
      {editMode && (
        <>
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            aria-label="Change icon"
            className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-border/60 bg-card text-text-primary shadow-sm transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Pencil className="h-2.5 w-2.5" />
          </button>
          {pickerOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setPickerOpen(false)}
              />
              <div
                className="absolute left-0 top-full z-30 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-5 gap-1">
                  {ICON_OPTIONS.map((key) => {
                    const isActive = key === currentKey;
                    return (
                      <button
                        key={key}
                        type="button"
                        title={key}
                        onClick={() => saveIcon(key)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg border text-text-secondary transition-colors hover:border-primary/40 hover:text-primary",
                          isActive
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/60"
                        )}
                      >
                        <IconGlyph iconKey={key} className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
