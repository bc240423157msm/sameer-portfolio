"use client";

import { useState } from "react";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/utils/cn";

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export function ReviewForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const { success, error: toastError } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: formData.get("author"),
          role: formData.get("role"),
          quote: formData.get("quote"),
          rating,
          website: formData.get("website"), // honeypot
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.error ?? "Could not submit your review.";
        toastError(msg);
        return;
      }

      setSubmitted(true);
      success("Thank you! Your review has been submitted.");
      form.reset();
    } catch {
      toastError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" />
        <h3 className="mt-4 text-lg font-semibold text-text-primary">
          Thank you for your review!
        </h3>
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          It&apos;s been sent for a quick check and will appear on the site
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from real users, bots tend to fill every field */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">
          Your rating
        </label>
        <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  (hoverRating || rating) >= n
                    ? "fill-accent text-accent"
                    : "text-border"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="author" className="mb-1.5 block text-sm font-medium text-text-primary">
            Your name
          </label>
          <input id="author" name="author" type="text" required maxLength={100} className={inputClass} placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-text-primary">
            Role / Company (optional)
          </label>
          <input id="role" name="role" type="text" maxLength={100} className={inputClass} placeholder="Founder, Acme Inc." />
        </div>
      </div>

      <div>
        <label htmlFor="quote" className="mb-1.5 block text-sm font-medium text-text-primary">
          Your review
        </label>
        <textarea
          id="quote"
          name="quote"
          required
          rows={5}
          maxLength={800}
          className={inputClass}
          placeholder="Tell others what it was like working together..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit review
      </button>
    </form>
  );
}
