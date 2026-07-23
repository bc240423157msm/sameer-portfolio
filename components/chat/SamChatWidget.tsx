"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  X,
  Send,
  Smile,
  Paperclip,
  Minimize2,
  Loader2,
  Film,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { SAM_GREETING, SAM_NAME, SAM_TAGLINE } from "@/lib/sam-config";
import type { ChatAttachment, ChatMessage } from "@/types/chat";
import { EmojiPicker } from "./EmojiPicker";

const STORAGE_KEY = "sam-chat-messages";

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ChatMessage[];
  } catch {
    /* ignore */
  }
  return [];
}

function saveMessages(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    /* ignore */
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function SamChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = loadMessages();
    if (stored.length > 0) {
      setMessages(stored);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: SAM_GREETING,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  function clearPendingFile() {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) return;

    const maxSize = isVideo ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(isVideo ? "Video must be under 20MB" : "Image must be under 5MB");
      return;
    }

    clearPendingFile();
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  async function sendMessage() {
    const text = input.trim();
    if ((!text && !pendingFile) || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
      attachment: pendingFile
        ? {
            type: pendingFile.type.startsWith("video/") ? "video" : "image",
            name: pendingFile.name,
            dataUrl: pendingPreview!,
          }
        : undefined,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setShowEmoji(false);
    setLoading(true);

    const historyForApi = updatedMessages
      .filter((m) => m.id !== "greeting")
      .map((m) => ({ role: m.role, content: m.content }));

    let imageBase64: string | undefined;
    let imageMimeType: string | undefined;
    let attachmentNote: string | undefined;

    if (pendingFile) {
      if (pendingFile.type.startsWith("image/")) {
        imageBase64 = await fileToBase64(pendingFile);
        imageMimeType = pendingFile.type;
      } else {
        attachmentNote = `[User shared a video: ${pendingFile.name}. Acknowledge receipt and ask how you can help with their project.]`;
      }
    }

    clearPendingFile();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyForApi,
          imageBase64,
          imageMimeType,
          attachmentNote,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.ok
          ? data.reply
          : data.error ?? "Sorry, I couldn't respond. Please try again.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Connection issue — please check your internet and try again, or reach out via the contact page.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Chat panel */}
      <div
        className={cn(
          "fixed bottom-24 left-6 z-50 flex w-[calc(100vw-3rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/10 transition-all duration-300 sm:bottom-6 sm:left-6",
          isOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
        style={{ height: isOpen ? "min(560px, calc(100vh - 7rem))" : 0 }}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border/60 bg-gradient-to-r from-primary/20 to-accent/10 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-text-primary">{SAM_NAME}</p>
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {SAM_TAGLINE}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
            aria-label="Minimize chat"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-surface/30 p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "rounded-br-md bg-primary text-white"
                    : "rounded-bl-md border border-border/40 bg-card text-text-secondary"
                )}
              >
                {msg.role === "assistant" && (
                  <p className="mb-1 text-xs font-medium text-accent">
                    {SAM_NAME}
                  </p>
                )}
                {msg.attachment?.type === "image" && (
                  <img
                    src={msg.attachment.dataUrl}
                    alt={msg.attachment.name}
                    className="mb-2 max-h-40 rounded-lg object-cover"
                  />
                )}
                {msg.attachment?.type === "video" && (
                  <video
                    src={msg.attachment.dataUrl}
                    controls
                    className="mb-2 max-h-40 w-full rounded-lg"
                  />
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    msg.role === "user" ? "text-white/60" : "text-text-muted"
                  )}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border/40 bg-card px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                <span className="text-sm text-text-muted">
                  {SAM_NAME} is typing...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Pending attachment preview */}
        {pendingPreview && pendingFile && (
          <div className="border-t border-border/40 bg-surface/50 px-4 py-2">
            <div className="flex items-center gap-2">
              {pendingFile.type.startsWith("image/") ? (
                <img
                  src={pendingPreview}
                  alt="Preview"
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card">
                  <Film className="h-5 w-5 text-accent" />
                </div>
              )}
              <span className="flex-1 truncate text-xs text-text-secondary">
                {pendingFile.name}
              </span>
              <button
                type="button"
                onClick={clearPendingFile}
                className="text-text-muted hover:text-error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="relative border-t border-border/60 bg-card p-3">
          {showEmoji && (
            <div className="absolute bottom-full left-0 mb-2 w-full px-3">
              <EmojiPicker
                onSelect={(emoji) => {
                  setInput((prev) => prev + emoji);
                  inputRef.current?.focus();
                }}
                onClose={() => setShowEmoji(false)}
              />
            </div>
          )}

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => setShowEmoji((p) => !p)}
              className="shrink-0 rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface hover:text-accent"
              aria-label="Add emoji"
            >
              <Smile className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface hover:text-accent"
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Sam..."
              rows={1}
              className="max-h-24 flex-1 resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || (!input.trim() && !pendingFile)}
              className="shrink-0 rounded-xl bg-primary p-2.5 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-text-muted">
            Powered by AI · For quotes contact Sameer directly
          </p>
        </div>
      </div>

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className={cn(
          "fixed bottom-6 left-6 z-50 flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-4 text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label={`Chat with ${SAM_NAME}`}
      >
        <Bot className="h-6 w-6" />
        <span className="pr-1 text-sm font-semibold">Chat with Sam</span>
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] font-bold">
          1
        </span>
      </button>
    </>
  );
}
