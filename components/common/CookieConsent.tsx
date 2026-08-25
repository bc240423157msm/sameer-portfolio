"use client";

import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent";

type ConsentChoice = "accepted" | "rejected";

/** True once the visitor has already made a choice (either accept or reject). */
function hasStoredChoice(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Bottom cookie-consent banner shown to first-time visitors. Remembers the
 * visitor's choice in localStorage so it never shows again on this device
 * once they've accepted or declined.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Small delay so the banner doesn't fight with the page-load overlay.
    const timer = setTimeout(() => {
      if (!hasStoredChoice()) setVisible(true);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  function choose(choice: ConsentChoice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // localStorage unavailable (private mode etc.) — banner just won't persist.
    }
    setClosing(true);
    setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className={`fixed inset-x-0 bottom-0 z-[900] flex justify-center px-4 pb-4 transition-all duration-300 ease-out sm:px-6 ${
        closing ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-2xl border border-border/60 bg-card/95 p-5 shadow-2xl shadow-black/20 backdrop-blur-md sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="flex items-start gap-3 sm:items-center">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Cookie className="h-4.5 w-4.5" />
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">
            We use cookies to improve your browsing experience and analyze
            site traffic. By clicking &ldquo;Accept&rdquo;, you agree to our
            use of cookies. Read our{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-accent underline underline-offset-2 hover:text-primary"
            >
              Privacy Policy
            </Link>{" "}
            to learn more.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:ml-auto">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-text-primary"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => choose("rejected")}
            aria-label="Dismiss cookie notice"
            className="hidden shrink-0 items-center justify-center rounded-lg p-1.5 text-text-secondary transition-colors hover:text-text-primary sm:flex"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
