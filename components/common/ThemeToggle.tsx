"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { cn } from "@/utils/cn";

type ThemePref = "light" | "dark" | "auto";

const STORAGE_KEY = "theme";
const PREF_CHANGE_EVENT = "themepref-change";

const options: { value: ThemePref; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "White theme", icon: Sun },
  { value: "dark", label: "Dark theme", icon: Moon },
  { value: "auto", label: "Match system", icon: Monitor },
];

function resolveTheme(pref: ThemePref): "light" | "dark" {
  if (pref !== "auto") return pref;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(pref: ThemePref) {
  const resolved = resolveTheme(pref);

  const setAttrs = () => {
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute("data-theme-pref", pref);
  };

  if (
    typeof document !== "undefined" &&
    "startViewTransition" in document
  ) {
    (
      document as Document & {
        startViewTransition: (cb: () => void) => void;
      }
    ).startViewTransition(setAttrs);
  } else {
    setAttrs();
  }

  localStorage.setItem(STORAGE_KEY, pref);
  window.dispatchEvent(new Event(PREF_CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(PREF_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(PREF_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): ThemePref {
  return (localStorage.getItem(STORAGE_KEY) as ThemePref) || "dark";
}

function getServerSnapshot(): ThemePref {
  return "dark";
}

export function ThemeToggle({ className }: { className?: string }) {
  const pref = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (getSnapshot() === "auto") applyTheme("auto");
    };
    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, []);

  const handleSelect = (value: ThemePref) => applyTheme(value);

  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5",
        className
      )}
    >
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={pref === value}
          onClick={() => handleSelect(value)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300",
            pref === value
              ? "bg-primary text-white"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
