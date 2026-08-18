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
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useSetupStatus } from "@/components/portal/SetupChecklist";
import { cn } from "@/utils/cn";

type PreviewWidth = "desktop" | "tablet" | "mobile";

const previewWidths: Record<PreviewWidth, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export function AdminToolbar() {
  const pathname = usePathname();
  const { success } = useToast();
  const { unresolvedCount } = useSetupStatus();
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
      <div className="fixed left-0 right-0 top-0 z-[10002] flex h-11 items-center justify-between gap-3 border-b border-border/60 bg-card/95 px-4 text-xs shadow-sm backdrop-blur-md">
        {/* Left: current page + edit mode toggle */}
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex items-center gap-1.5 text-text-secondary">
            <Pencil className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate font-medium text-text-primary">
              {pageName}
            </span>
          </span>

          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors",
              editMode
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "bg-surface text-text-secondary hover:bg-surface/80 hover:text-text-primary"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                editMode ? "bg-white" : "bg-text-muted"
              )}
              aria-hidden
            />
            Edit Mode: {editMode ? "On" : "Off"}
          </button>
        </div>

        {/* Right: device preview, save state, setup alerts, dashboard link */}
        <div className="flex shrink-0 items-center gap-1">
          {editMode && (
            <div className="mr-1 flex items-center gap-0.5 border-r border-border/60 pr-2">
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
                  title={`${w[0]!.toUpperCase()}${w.slice(1)} preview`}
                  onClick={() => setPreviewWidth(w)}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    previewWidth === w
                      ? "bg-primary/15 text-primary"
                      : "text-text-muted hover:bg-surface hover:text-text-primary"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          )}

          {dirty && (
            <div className="mr-1 flex items-center gap-1 border-r border-border/60 pr-2">
              <button
                type="button"
                onClick={handleDiscard}
                title="Discard changes and reload"
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
              >
                <RotateCcw className="h-3 w-3" />
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveAll}
                className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 font-medium text-white transition-opacity hover:opacity-90"
              >
                <Save className="h-3 w-3" />
                Saved
              </button>
            </div>
          )}

          {unresolvedCount > 0 && (
            <Link
              href="/portal/admin"
              title={`${unresolvedCount} setup item(s) pending — click to review`}
              className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 font-medium text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
            >
              <AlertTriangle className="h-3 w-3 shrink-0" />
              {unresolvedCount}
            </Link>
          )}

          <Link
            href="/portal/admin"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-primary"
          >
            <LayoutDashboard className="h-3 w-3" />
            Dashboard
          </Link>
        </div>
      </div>

      {/* Spacer so content isn't hidden under toolbar */}
      <div className="h-11" aria-hidden />

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
