# Sameer Portfolio

Production-ready Next.js 16 portfolio for an international freelance developer — built with the App Router, TypeScript, and Tailwind CSS v4.

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- ESLint + Prettier

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with Turbopack |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the codebase with Prettier |

## Project Structure

```
app/                  Routes (App Router) — one folder per page
components/
  layout/             Navbar, Footer, Container
  ui/                 Low-level, reusable UI primitives (buttons, inputs, etc.)
  sections/           Page-section building blocks (Hero, etc.)
  common/             Shared small components (PageHeader, BackToTopButton)
lib/                  Site config and shared server-side logic
hooks/                Reusable client-side hooks
types/                Shared TypeScript types
utils/                Small utility functions (e.g. cn)
public/               Static assets
styles/               Reserved for additional global styles
```

## Design System

Colors, typography, and spacing tokens are defined in `app/globals.css` using Tailwind v4's `@theme` directive, based on the "Graphite AI" design system (dark, technical, premium).

## Planned Additions (Architecture Ready, Not Yet Implemented)

- Dark mode toggle
- Blog CMS integration
- AI chatbot widget
- Case study detail pages
- Testimonials section
- Working contact form with validation & email delivery
- Admin dashboard

## SEO

Every page exports its own `metadata` (title + description). `app/sitemap.ts` and `app/robots.ts` are configured and ready — update `siteConfig.url` in `lib/site-config.ts` with the production domain before launch.
