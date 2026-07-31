"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Pencil,
  Save,
  RotateCcw,
  LayoutDashboard,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/utils/cn";

type PreviewWidth = "desktop" | "tablet" | "mobile";

const previewWidths: Record<PreviewWidth, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export function AdminToolbar() {
  const pathname = usePathname();
  const { success, error } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("desktop");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("editMode");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "true") setEditMode(true);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("editMode", String(editMode));
    document.documentElement.setAttribute(
      "data-edit-mode",
      editMode ? "on" : "off"
    );
    window.dispatchEvent(
      new CustomEvent("editmode-change", { detail: editMode })
    );
  }, [editMode]);

  useEffect(() => {
    function onDirty() {
      setDirty(true);
    }
    window.addEventListener("content-dirty", onDirty);
    return () => window.removeEventListener("content-dirty", onDirty);
  }, []);

  const pageName =
    pathname === "/"
      ? "Home"
      : pathname
          .slice(1)
          .split("/")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" / ");

  const handleDiscard = useCallback(() => {
    window.location.reload();
  }, []);

  const handleSaveAll = useCallback(async () => {
    success("All changes are saved per-field automatically");
    setDirty(false);
  }, [success]);

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[10002] flex h-10 items-center justify-between border-b border-border/60 bg-card/95 px-4 text-xs backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Pencil className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium text-text-primary">{pageName}</span>
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            className={cn(
              "rounded-full px-3 py-1 font-medium transition-colors",
              editMode
                ? "bg-primary text-white"
                : "bg-surface text-text-secondary hover:text-text-primary"
            )}
          >
            Edit Mode: {editMode ? "On" : "Off"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {editMode && (
            <div className="mr-2 flex items-center gap-1 border-r border-border/60 pr-2">
              {(
                [
                  ["desktop", Monitor],
                  ["tablet", Tablet],
                  ["mobile", Smartphone],
                ] as const
              ).map(([w, Icon]) => (
                <button
                  key={w}
                  type="button"
                  aria-label={`${w} preview`}
                  onClick={() => setPreviewWidth(w)}
                  className={cn(
                    "rounded p-1 transition-colors",
                    previewWidth === w
                      ? "bg-primary/15 text-primary"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          )}

          {dirty && (
            <>
              <button
                type="button"
                onClick={handleDiscard}
                className="flex items-center gap-1 rounded px-2 py-1 text-text-secondary hover:text-text-primary"
              >
                <RotateCcw className="h-3 w-3" />
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                className="flex items-center gap-1 rounded bg-primary px-3 py-1 font-medium text-white"
              >
                <Save className="h-3 w-3" />
                Saved
              </button>
            </>
          )}

          <Link
            href="/portal/admin"
            className="flex items-center gap-1 rounded px-2 py-1 text-text-secondary transition-colors hover:text-primary"
          >
            <LayoutDashboard className="h-3 w-3" />
            Dashboard
          </Link>
        </div>
      </div>

      {/* Spacer so content isn't hidden under toolbar */}
      <div className="h-10" aria-hidden />

      {editMode && previewWidth !== "desktop" && (
        <style>{`
          #main-content {
            max-width: ${previewWidths[previewWidth]};
            margin-left: auto;
            margin-right: auto;
            transition: max-width 0.3s ease;
            box-shadow: 0 0 0 1px var(--color-border);
          }
        `}</style>
      )}
    </>
  );
}

/** Hook for child components to know if edit mode is active. */
export function useEditMode() {
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const check = () =>
      setEditMode(document.documentElement.getAttribute("data-edit-mode") === "on");
    check();
    const handler = (e: Event) =>
      setEditMode((e as CustomEvent<boolean>).detail);
    window.addEventListener("editmode-change", handler);
    return () => window.removeEventListener("editmode-change", handler);
  }, []);

  return editMode;
}
