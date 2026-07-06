# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Run production build locally
npm run lint     # Run ESLint (next lint)
```

There is no JS/TS test suite. End-to-end smoke tests live in `pulse_tests/` (Python + Selenium, Page Object Model), separate from the Next.js app and its own venv:

```bash
cd pulse_tests
pip install -r tests/requirements-test.txt
python -m pytest tests/ -v              # run all
python -m pytest tests/test_pulse_smoke.py::test_name -v   # run one
```

These tests drive headless Chrome against a **running app** (default `http://localhost:3000` — check `pages/home_page.py`/`conftest.py` for the base URL), so start `npm run dev` first. They use only explicit `WebDriverWait` waits — no `implicitly_wait()` or `time.sleep()` — and each test is independent (own page load, no shared state).

## Environment variables

Required in `.env.local` (see `.env.local.example`):
- `GUARDIAN_API_KEY` — news source (server-only; The Guardian Open Platform, the only free source that legally serves full article text)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — Supabase
- `ANTHROPIC_API_KEY` — AI summaries (Claude 3.5 Sonnet)
- `NEXT_PUBLIC_APP_URL` — used server-side to call the app's own `/api/articles/sync` route
- `TWELVE_DATA_API_KEY` / `API_FOOTBALL_KEY` — optional, power the Business/Sports category widgets (see below). Server-only (no `NEXT_PUBLIC_` prefix); widgets degrade to a graceful "unavailable" state when unset.

Supabase schema lives in `supabase/migrations/001_init.sql` — apply it manually via the Supabase SQL editor (no migration runner is wired up).

## Architecture

Next.js 14 App Router news aggregator. The key thing to understand is the **split between two data paths**:

1. **Live feed (NewsAPI + Guardian, not persisted per-request)** — `app/page.tsx`, `category/[slug]`, and `search` fetch directly from `lib/newsapi.ts` and `lib/guardian.ts` on each request (ISR, `revalidate = 300`), merge them with `lib/mergeFeeds.ts`, and render immediately. This is what powers the homepage/category/search feeds.
2. **Supabase-backed article details** — after rendering, `app/page.tsx` fires a non-blocking `POST /api/articles/sync` to upsert the fetched articles into the Supabase `articles` table (`app/api/articles/sync/route.ts`, service-role client, `onConflict: 'id'`, never overwrites existing rows). Individual article pages (`app/article/[id]/page.tsx`) then read *from Supabase*, not from the live APIs — so an article is only viewable at `/article/[id]` once it has been synced by a prior feed render.

Consequences worth knowing before changing this:
- Article `id`s are deterministic hashes of the source URL (`hashString` in both `lib/newsapi.ts` and `lib/guardian.ts`, prefixed `newsapi-`/`guardian-`) — this is what lets the live feed and the Supabase-cached copy refer to the same article.
- `lib/mergeFeeds.ts` dedupes across sources by title token-overlap similarity (85% threshold), not by ID — NewsAPI and Guardian can both carry the same story under different IDs.
- AI summaries (`app/api/articles/[id]/summarize/route.ts`) and related articles (`lib/relatedArticles.ts`, same-category lookup) both read/write the Supabase `articles` row, not the live API — they only work for synced articles. Summaries are generated once via Anthropic and cached in the `ai_summary` column.
- Russian-language support only goes through NewsAPI's `/everything` endpoint (`q=новости`); Guardian has no Russian content and is skipped entirely when `language === 'ru'` (`lib/guardian.ts`, `lib/newsapi.ts`).

Auth: Supabase Google OAuth + magic link. `middleware.ts` refreshes the session on every request (matcher excludes static assets). `app/auth/callback/route.ts` exchanges the OAuth code for a session and redirects to a `redirect` query param. `lib/supabase/client.ts` (browser) vs `lib/supabase/server.ts` (server components/routes, cookie-based) vs `createServiceRoleClient()` (bypasses RLS, used only in server-side sync/summarize/save routes) are three distinct client constructors — pick the one matching the execution context.

Row-level security: `articles` is publicly readable but only insertable via the service-role key (`supabase/migrations/001_init.sql`); `saved_articles` is scoped per-user via `auth.uid()`.

Theme (dark/light) and language preference are client-side only, persisted to `localStorage` (see `ThemeToggle.tsx`, `LanguageToggle.tsx`); language changes trigger a full page reload with `?lang=` since article fetching is server-side.

### Per-category theming and widgets

`lib/categories.ts` is the single source of truth for the 6 categories — slug, label, page title, accent color classes, `lucide-react` icon, and an optional live-data widget + placement (`sidebar` | `top-banner` | `below-hero`). Both `app/category/[slug]/page.tsx` and `components/CategoryNav.tsx` read from it instead of hardcoding their own category lists — add a new category or change a widget there, not in either of those files. Tailwind's JIT scanner only picks up literal class strings, so per-category colors are full literal Tailwind classes (`text-emerald-600 dark:text-emerald-400`, etc.) in the config, never built with template-string interpolation.

Widget data fetchers live in `lib/widgets/` and follow the same resilience pattern as `lib/newsapi.ts`: try/catch, `console.error` on failure, return `null`/`[]` instead of throwing, `fetch(url, { next: { revalidate } })` for caching. `revalidate` windows are chosen against each free-tier API's daily/hourly quota (see comments in each file) — if you see 429s in logs, raise the revalidate window rather than adding retry logic. The Business (Twelve Data) and Sports (API-Football) widgets require API keys the widget doesn't have by default; Technology (GitHub) and Science (arXiv) widgets need no key.
