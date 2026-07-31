"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

declare global {
  interface Window {
    google?: { translate?: { TranslateElement?: new (options: object, elementId: string) => unknown } };
    googleTranslateElementInit?: () => void;
  }
}

const PREF_KEY = "site-lang-pref"; // "original" once the visitor chooses to go back to English
const SITE_LANG = "en";

/** Languages Google Website Translator supports out of the box. We don't need
 * to hardcode individual codes — passing an empty `includedLanguages`
 * (default) lets it offer/translate into whatever the browser asks for. */
function getVisitorLanguage(): string | null {
  const lang = (navigator.language || navigator.languages?.[0] || "").toLowerCase();
  if (!lang) return null;
  const primary = lang.split("-")[0];
  if (!primary || primary === SITE_LANG) return null;
  return primary;
}

function setGoogTransCookie(lang: string) {
  const value = `/${SITE_LANG}/${lang}`;
  // Needs to be set on both the bare host and with a leading dot so it
  // applies regardless of how the widget reads it back.
  document.cookie = `googtrans=${value};path=/`;
  const host = window.location.hostname;
  if (host && host !== "localhost") {
    document.cookie = `googtrans=${value};path=/;domain=.${host}`;
  }
}

function clearGoogTransCookie() {
  document.cookie = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const host = window.location.hostname;
  if (host && host !== "localhost") {
    document.cookie = `googtrans=;path=/;domain=.${host};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

/**
 * Silently auto-translates the public site into the visitor's browser
 * language on first load (a reliable stand-in for "their country's
 * language" — far more accurate than guessing from IP geolocation, and it
 * doesn't need any paid translation API key).
 *
 * Deliberately client-side only: search engine crawlers never run this
 * script, so the English version is still what gets indexed — this widget
 * only changes what a real visitor sees in their own browser, and never
 * touches the HTML we serve for SEO.
 */
export function AutoTranslate() {
  const [translated, setTranslated] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(PREF_KEY) === "original") return;

    const visitorLang = getVisitorLanguage();
    if (!visitorLang) return;

    setGoogTransCookie(visitorLang);
    // Browser language is only knowable client-side after mount, so this
    // effect reacting once with setState is the correct pattern here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTranslated(true);

    if (document.getElementById("google-translate-script")) {
      setReady(true);
      return;
    }

    const container = document.createElement("div");
    container.id = "google_translate_element";
    container.style.cssText =
      "position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;left:-9999px;";
    document.body.appendChild(container);

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: SITE_LANG, autoDisplay: false },
        "google_translate_element"
      );
      setReady(true);
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function viewOriginal() {
    localStorage.setItem(PREF_KEY, "original");
    clearGoogTransCookie();
    window.location.reload();
  }

  if (!translated || !ready) return null;

  return (
    <button
      type="button"
      onClick={viewOriginal}
      translate="no"
      className="notranslate fixed bottom-4 left-4 z-40 flex items-center gap-1.5 rounded-full border border-border/60 bg-card/90 px-3 py-2 text-xs font-medium text-text-secondary shadow-lg backdrop-blur-sm transition-colors hover:text-text-primary"
    >
      <Languages className="h-3.5 w-3.5" aria-hidden />
      View in English
    </button>
  );
}
