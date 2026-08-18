"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

/** Real WhatsApp glyph (not a generic chat-bubble icon) so the button is
 * instantly recognizable as WhatsApp. */
function WhatsAppIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.29-.14-1.71-.84-1.98-.94-.27-.1-.46-.14-.65.14-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.65-1.57-.9-2.15-.24-.57-.48-.49-.65-.5-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.42 0 1.43 1.02 2.82 1.17 3.01.14.19 2 3.05 4.84 4.28.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33ZM12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.32A9.94 9.94 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2Zm0 18.13c-1.7 0-3.29-.47-4.65-1.28l-.33-.2-3.15.82.84-3.07-.22-.32A8.07 8.07 0 0 1 3.9 12c0-4.48 3.65-8.13 8.12-8.13 4.48 0 8.12 3.65 8.12 8.13 0 4.48-3.64 8.13-8.12 8.13Z" />
    </svg>
  );
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hi Sameer, I'd like to discuss a project.",
}: WhatsAppButtonProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(message);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const cleaned = phoneNumber.replace(/\D/g, "");

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }, 50);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!cleaned || cleaned.length < 8) return null;

  function sendMessage() {
    const finalMessage = text.trim() || message;
    const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          role="dialog"
          aria-label="Send a WhatsApp message"
        >
          <div className="flex items-center justify-between gap-3 bg-[#25D366] px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <WhatsAppIcon className="h-5 w-5" />
              <span className="text-sm font-semibold">Chat on WhatsApp</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-full p-1 text-white/90 transition-colors hover:bg-white/15 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 p-4">
            <p className="text-xs text-text-secondary">
              Write a quick message, then tap Done to open WhatsApp and send it.
            </p>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Type your message..."
            />
            <button
              type="button"
              onClick={sendMessage}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Send className="h-4 w-4" />
              Done
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((prev) => {
            const next = !prev;
            if (next) setText(message);
            return next;
          });
        }}
        aria-label={open ? "Close WhatsApp chat" : "Chat on WhatsApp"}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-110 hover:shadow-xl"
      >
        {open ? <X className="h-6 w-6" /> : <WhatsAppIcon className="h-7 w-7" />}
      </button>
    </>
  );
}
