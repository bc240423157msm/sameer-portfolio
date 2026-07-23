"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hi Sameer, I'd like to discuss a project.",
}: WhatsAppButtonProps) {
  const cleaned = phoneNumber.replace(/\D/g, "");
  if (!cleaned || cleaned.length < 8) return null;

  const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-110 hover:shadow-xl"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}
