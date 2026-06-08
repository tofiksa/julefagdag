# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Norwegian-language mobile-first agenda app for SPK Julefagdag 2025. Next.js 15 (App Router) + React 19 + TypeScript + Prisma/PostgreSQL + Tailwind 4. Hosted on Vercel. UI text is Norwegian — preserve language when editing user-facing strings. Detailed change recipes (UI tweaks, time/room edits, etc.) live in `HVORDAN_GJORE_JUSTERINGER.md`.

## Commands

```bash
npm run dev          # next dev (hot reload)
npm run build        # prisma generate && next build
npm run lint         # biome check  (lint only — biome, not eslint)
npm run format       # biome format --write
npm run db:seed      # tsx prisma/seed.ts  — DESTRUCTIVE: deletes all sessions+feedback first
npx prisma migrate dev --name <desc>   # create + apply local migration
npx prisma migrate deploy              # apply migrations in production
npx prisma generate                    # regen client after schema edits (also runs on postinstall)
```

No test framework configured. There is no `npm test`.

Running a single script: `tsx scripts/<name>.ts` (utility scripts live in `scripts/`).

## Architecture

### Data model (`prisma/schema.prisma`)
Three models, all in PostgreSQL:
- `Session` — talks/agenda items. Has many `Feedback`.
- `Feedback` — per-session yes/no answers (`useful`, `learned`, `explore`). Cascade-deletes with session.
- `EventFeedback` — overall event feedback (free-text `comment` + optional 1–5 `rating`). Not linked to a session.

Sessions are seeded from `prisma/seed.ts`. The seed **wipes the entire DB** before inserting, so running it in prod will destroy collected feedback. Production data changes should be done via a script or migration, not seed.

### App structure (Next.js App Router)
- `app/page.tsx` — main agenda view (client component). Polls `/api/sessions` every 30s, refreshes `currentTime` every minute, drives the "Nå/Kommende/Ferdig" grouping.
- `app/favorites/` — favorites view (favorites stored in localStorage, not DB).
- `app/qr/` — QR-code share page.
- `app/admin/feedback/page.tsx` — admin dashboard showing aggregated feedback. Gated by `AdminLoginForm`.
- `app/sw-register.tsx` — registers `/public/sw.js` client-side for PWA + notifications.

### API routes (all under `app/api/`)
- `GET /api/sessions` — public; `force-dynamic`, no-cache headers (the agenda must reflect seed/migration changes immediately).
- `POST /api/feedback` — public submit.
- `GET /api/feedback/results` — **admin-only** (checks cookie via `verifyAdminAuth`).
- `POST /api/event-feedback`, `GET /api/event-feedback` (admin) — event-level feedback.
- `POST /api/admin/auth` — password check, sets httpOnly cookie.
- `POST /api/admin/logout` — clears cookie.

### Admin auth — read this before touching auth
Two parallel layers, both required:
1. **Server-side** (`lib/admin-auth-server.ts`): httpOnly cookie `admin_auth`, 24h. Token is base64 of `admin_<password>_<timestamp>` — **unsigned**, validated only by presence + non-empty value. This is intentionally minimal; the comments explicitly flag it as a placeholder for real JWT/signature verification. Treat any feedback-results or admin-mutating endpoint as needing `verifyAdminAuth(request)`.
2. **Client-side** (`lib/admin-auth.ts`): a `localStorage` flag (`admin_authenticated`) used only to decide what to render in `app/admin/feedback/page.tsx`. It does **not** protect data — server auth does.

Default password: `process.env.ADMIN_PASSWORD` (falls back to `'julefagdag2025'` in dev). Don't rely on the fallback for anything real.

### State / persistence boundaries
- Favorites + "feedback submitted" markers + admin flag → **localStorage** (client only).
- Sessions, feedback, event feedback → **PostgreSQL via Prisma**.
- Notifications: web Notifications API, fired 10 min before a favorited session starts. See `NOTIFICATION_DELAY_MINUTES` in `hooks/useNotifications.ts`. Uses service worker when available, falls back to `new Notification(...)`.

### Time/status logic
All time-bucket logic (`upcoming` / `current` / `completed`) is centralized in `lib/utils.ts` (`getSessionStatus`, `sortSessionsByTime`, `groupSessionsByStatus`). Change behavior here, not in components. Time formatting uses `Intl.DateTimeFormat('no-NO', ...)`.

### Prisma client
Always import from `@/lib/prisma` (singleton with hot-reload guard via `globalThis`). Do not `new PrismaClient()` directly in route handlers.

## Conventions

- **Path alias**: `@/*` → repo root (configured in `tsconfig.json`). Use `@/lib/...`, `@/components/...`.
- **Linting/formatting**: Biome (`biome.json`). Indent = 2 spaces. `noUnknownAtRules` disabled to allow Tailwind directives. No ESLint/Prettier.
- **Styling**: Tailwind v4 (via `@tailwindcss/postcss`). Use `cn()` from `lib/utils.ts` for class merging.
- **Client vs server**: Pages that use hooks/localStorage need `'use client'`. API route handlers are server-only.
- **Commit style**: Conventional commits (`feat(...)`, `fix(...)`, etc.) — see `git log`.

## Deployment

Vercel auto-deploys `main`. The `postinstall` hook runs `prisma generate`. Migrations and seeding are **not** automatic — see `DEPLOYMENT.md` / `DATABASE_SETUP.md` / `setup-database.sh` for the manual `vercel env pull` → `prisma migrate deploy` flow. `DATABASE_URL` must be set in Vercel env vars (Vercel Postgres exposes `POSTGRES_URL` — copy/alias to `DATABASE_URL`).
