"use client";

import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface NewsletterSignupProps {
  variant?: "footer" | "sidebar";
}

export function NewsletterSignup({ variant = "footer" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        error(data.error ?? "Subscription failed");
        return;
      }

      success("You're subscribed! Check your inbox.");
      setEmail("");
    } catch {
      error("Connection error");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "sidebar") {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
        <h3 className="font-semibold text-text-primary">Newsletter</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Get web dev tips and project updates in your inbox.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-3 py-2 text-white disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-md">
      <p className="text-sm font-medium text-text-primary">Stay updated</p>
      <p className="mt-1 text-xs text-text-secondary">
        Subscribe for web development tips and project updates.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
