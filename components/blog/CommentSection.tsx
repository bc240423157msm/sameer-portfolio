"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { BlogComment } from "@/types/content";

interface CommentSectionProps {
  postSlug: string;
}

export function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { success, error: toastError } = useToast();

  useEffect(() => {
    let cancelled = false;
    async function loadComments() {
      try {
        const res = await fetch(
          `/api/blog/comments?slug=${encodeURIComponent(postSlug)}`
        );
        const data = await res.json();
        if (!cancelled) setComments(data.comments ?? []);
      } catch {
        // silently ignore — comments are non-critical
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadComments();
    return () => {
      cancelled = true;
    };
  }, [postSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !message.trim()) {
      setError("Please add your name and a comment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, name, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.error ?? "Something went wrong. Please try again.";
        setError(msg);
        toastError(msg);
        return;
      }

      setComments((prev) => [data.comment, ...prev]);
      setName("");
      setMessage("");
      success("Comment posted!");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="flex items-center gap-2 text-2xl font-semibold text-text-primary">
        <MessageCircle className="h-5 w-5 text-accent" />
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={80}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:col-span-2"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            maxLength={2000}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:col-span-2"
          />
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-error/30 bg-error/10 px-4 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Post Comment
        </button>
      </form>

      <div className="mt-8 space-y-6">
        {loading ? (
          <p className="text-sm text-text-muted">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-text-muted">
            No comments yet — be the first to share your thoughts.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-border/60 bg-card/30 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-text-primary">
                  {comment.name}
                </p>
                <time className="text-xs text-text-muted">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {comment.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
