"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export interface ConfigStatus {
  dbConfigured: boolean;
  blobConfigured: boolean;
  resendConfigured: boolean;
  resendFromConfigured: boolean;
  contactEmailConfigured: boolean;
  gaConfigured: boolean;
  groqConfigured: boolean;
  gscConfigured: boolean;
}

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
  resolved: boolean;
}

const SNOOZE_KEY = "setup-checklist-snoozed";
// Re-checks in the background so an item disappears on its own the moment
// it's actually fixed — no manual page refresh needed.
const POLL_MS = 20_000;

function getSnoozed(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(SNOOZE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function buildItems(status: ConfigStatus): ChecklistItem[] {
  return [
    {
      id: "db",
      label: "Site data database (Redis) connect nahi",
      detail:
        "Blog posts, content edits, users — sab reset ho sakte hain redeploy pe. Vercel → Project → Storage → Create Database → Upstash Redis → Connect → Redeploy.",
      resolved: status.dbConfigured,
    },
    {
      id: "blob",
      label: "Image storage (Vercel Blob) connect nahi",
      detail:
        "Upload ki gayi images ghayab ho sakti hain. Vercel → Project → Storage → Create Database → Blob → Connect → Redeploy.",
      resolved: status.blobConfigured,
    },
    {
      id: "resend-key",
      label: "Email bhejne ki key (RESEND_API_KEY) set nahi",
      detail:
        "Contact form se aapko email nahi milega jab tak yeh set na ho. Vercel → Project → Settings → Environment Variables → RESEND_API_KEY add karein → Redeploy.",
      resolved: status.resendConfigured,
    },
    {
      id: "resend-from",
      label: "Bhejne wala email address (RESEND_FROM_EMAIL) set nahi",
      detail:
        "Resend mein verify kiya hua domain ka email yahan set karna hai, e.g. Sameer Malik <contact@sameermalik.dev>. Vercel env vars mein add karein.",
      resolved: status.resendFromConfigured,
    },
    {
      id: "contact-email",
      label: "Aapka receiving email set nahi",
      detail:
        "Contact form ke messages kis email pe aayenge, ye tay nahi. Admin Dashboard → Settings tab mein 'Contact Form Email' bharein, ya CONTACT_EMAIL env var set karein.",
      resolved: status.contactEmailConfigured,
    },
    {
      id: "ga",
      label: "Google Analytics ID set nahi",
      detail:
        "Website traffic track nahi ho rahi. Admin Dashboard → Settings tab → 'Google Analytics ID' field mein apni GA4 Measurement ID (G-XXXXXXXXXX) bharein.",
      resolved: status.gaConfigured,
    },
    {
      id: "gsc",
      label: "Google Search Console verify nahi hai",
      detail:
        "Bina isske Google aapki site ko properly crawl/index nahi karega. search.google.com/search-console se verification code lekar Admin Dashboard → Settings → SEO & Search Console mein paste karein.",
      resolved: status.gscConfigured,
    },
    {
      id: "groq",
      label: "AI chatbot (Sam) key set nahi",
      detail:
        "Website ka AI chat widget kaam nahi karega. Vercel env vars mein GROQ_API_KEY add karein (console.groq.com se free key milti hai).",
      resolved: status.groqConfigured,
    },
  ];
}

/** Shared live status poller — used by the checklist banner itself and by
 * the admin toolbar badge, so both always agree on what's still pending. */
export function useSetupStatus() {
  const [status, setStatus] = useState<ConfigStatus | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function fetchStatus() {
      fetch("/api/config/status")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data && setStatus(data))
        .catch(() => {});
    }

    fetchStatus();
    pollRef.current = setInterval(fetchStatus, POLL_MS);

    function onFocus() {
      fetchStatus();
    }
    window.addEventListener("focus", onFocus);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const items = status ? buildItems(status) : [];
  const unresolvedCount = items.filter((i) => !i.resolved).length;

  return { status, items, unresolvedCount };
}

/**
 * Shows every unfinished setup item (email, storage, analytics, AI chat,
 * SEO verification) to the admin right after login. Re-checks live status
 * in the background, so once the underlying problem is actually fixed
 * (env var set + redeployed, or a Settings field saved) the item vanishes
 * by itself — nothing to dismiss or remember. Each item can still be
 * snoozed ("baad mein") for the current session if you want it out of the
 * way for now; it comes back next login until truly resolved.
 */
export function SetupChecklist() {
  const { status, items } = useSetupStatus();
  const [snoozed, setSnoozed] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setSnoozed(getSnoozed());
  }, []);

  if (!status) return null;

  const unresolved = items.filter((i) => !i.resolved);
  const pending = unresolved.filter((i) => !snoozed.includes(i.id));

  // Nothing left to fix at all — no banner, no noise.
  if (unresolved.length === 0) return null;
  // Everything remaining has been snoozed for this session — stay quiet
  // until something changes (a new item appears, or the poll clears one).
  if (pending.length === 0) return null;

  function snooze(id: string) {
    const next = [...snoozed, id];
    setSnoozed(next);
    sessionStorage.setItem(SNOOZE_KEY, JSON.stringify(next));
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-6">
      <motion.div
        layout
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm text-amber-700 shadow-sm dark:text-amber-400"
      >
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-amber-500/[0.06]"
        >
          <span className="flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/25 px-1.5 text-xs font-semibold tabular-nums">
              {pending.length}
            </span>
            setup {pending.length === 1 ? "item" : "items"} abhi solve karna
            baaki hai
          </span>
          {collapsed ? (
            <ChevronDown className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronUp className="h-4 w-4 shrink-0" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-2 px-4 pb-4"
            >
              <AnimatePresence initial={false}>
                {pending.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start justify-between gap-3 rounded-lg bg-amber-500/10 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="mt-0.5 text-xs text-amber-700/80 dark:text-amber-400/80">
                        {item.detail}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => snooze(item.id)}
                      title="Baad mein — is session ke liye hide karein"
                      className="flex shrink-0 items-center gap-1 rounded-md border border-amber-500/30 px-2 py-1 text-xs text-amber-700/90 transition-colors hover:bg-amber-500/15 dark:text-amber-400/90"
                    >
                      <X className="h-3 w-3" />
                      Baad mein
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>

              {unresolved.length < items.length && (
                <li className="flex items-center gap-1.5 px-3 pt-1 text-xs text-amber-700/70 dark:text-amber-400/70">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Baaki {items.length - unresolved.length} item(s) already
                  set — solve hote hi yeh list khud update ho jati hai.
                </li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
