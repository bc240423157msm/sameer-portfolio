# Changes made in this review

## Security fixes
- **`.gitignore` added** — was completely missing. Without it, `.env.local`
  (real passwords + API keys) would get committed to Git the first time this
  is pushed to a repo.
- **`.env.example` cleaned** — it had real-looking secrets (a Groq API key,
  admin password, etc.) hardcoded instead of placeholders. Replaced with
  generic placeholders. **Recommend rotating the Groq API key** at
  console.groq.com since it was sitting in a file meant to be shared/committed.
- **Login endpoint rate-limited** (`app/api/auth/login/route.ts`) — max 10
  attempts per IP per 15 minutes, via a new `lib/rate-limit.ts` helper.
- **Contact form rate-limited** (`app/api/contact/route.ts`) — max 5
  submissions per IP per 10 minutes, same helper.
- **Contact form HTML-escaping** — user-submitted name/email/subject/message
  are now escaped before being injected into the notification email's HTML,
  closing an HTML-injection hole.

## Next.js 16 correctness
- **`middleware.ts` → `proxy.ts`** — Next.js 16 deprecated the `middleware`
  file convention in favor of `proxy`; renamed the file and the exported
  function per the official migration guide.
- **`eslint.config.mjs` added** — was missing entirely, so `npm run lint`
  failed immediately. Uses `eslint-config-next`'s native flat-config exports.
- Fixed the two real errors and one warning ESLint turned up once it could
  actually run: a cascading-render bug in the chat widget's effects, and two
  `<img>` tags (documented why they're intentionally not `next/image` — they
  render client-only blob/data URLs, which next/image can't optimize anyway).

## Performance
- **`getSiteContent()` / `getBlogPosts()` wrapped in React's `cache()`**
  (`lib/data.ts`) — these were being called independently by 10+ different
  pages/layouts/components. A single page render could trigger 3-4+ redundant
  disk reads + JSON parses of the exact same file. Now it's read once per
  request and reused.
- **Chat widget no longer reads `sessionStorage` on every page load** — it
  now only loads/saves chat history the first time a visitor actually opens
  the widget, instead of on every single page navigation site-wide.
- **`background-attachment: fixed` scoped to non-touch devices** — this CSS
  property forces a repaint on every scroll frame on many mobile browsers,
  which is a common cause of janky-feeling scrolling. Desktop (mouse/trackpad)
  keeps the fixed background; touch devices now scroll it normally.

## Visual: animated header backgrounds
Added `components/common/AnimatedHeaderBackground.tsx` — a canvas-based
particle "constellation" network in the brand's emerald/teal/gold palette,
layered with slow-drifting blurred gradient shapes. No network request (unlike
the photo headers, which fetch from Unsplash), so it paints instantly.
Respects `prefers-reduced-motion` and pauses when the tab is hidden.

Applied as agreed — a mix of animated and photo headers:
- **Home** and **Services** → animated particle background (the two "hook"
  pages where a bold, modern first impression matters most)
- **About, Portfolio, Blog, Contact, Legal** → kept the photo headers

To animate any other page's header later, add `animated` to its `<PageHero />`
call in that page's `page.tsx`.

## Known limitation not fixed here (needs a decision from you)
**Data storage is local JSON files** (`data/*.json`, written via `fs`). This
works fine on a traditional server/VPS, but if this ever gets deployed to a
serverless platform like Vercel, the filesystem is ephemeral — content edits,
blog posts, and contact submissions saved through the admin dashboard can be
lost on redeploy/cold start. If Vercel (or similar) is the plan, this needs a
real database (e.g. Postgres, or Vercel KV) before launch — happy to wire that
up when you're ready.
