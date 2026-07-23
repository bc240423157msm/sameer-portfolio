"use client";

import dynamic from "next/dynamic";

// Chat widget is not needed for the first paint on any page, and it's one of
// the heavier client bundles (framer-motion + emoji picker). Loading it lazily
// keeps it out of the initial JS every page has to ship and parse.
// `ssr: false` requires this to live in a client component — it isn't allowed
// directly inside a server component like app/(site)/layout.tsx.
const SamChatWidget = dynamic(
  () => import("./SamChatWidget").then((m) => ({ default: m.SamChatWidget })),
  { ssr: false }
);

export function SamChatWidgetLoader() {
  return <SamChatWidget />;
}
