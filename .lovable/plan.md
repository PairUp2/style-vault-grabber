# Plan: CYNEX Production rebuild

## Goal
Replace the 1755-file static WordPress mirror with a clean TanStack Start React app. Visuals stay as close to current as possible (port the HTML/CSS markup verbatim into React components — no AI-redesigned look). Add a real Supabase-backed admin for videos & blog posts. Pull brand videos from `@cynexproduction` on YouTube.

---

## Phase 1 — Cleanup
- Delete every `public/site/*` page that isn't one of the 10 kept pages (and their referenced asset folders stay).
- Delete dead scripts: `scan-videos.js`, `scratch/`, `scripts/debug-*.mjs`, `scripts/parse-yt-channel.mjs`, etc.
- Delete unused server files: legacy `data/videos.json` (empty), `channel-videos.json` once imported.
- Drop empty `src/routes/api/public/videos.ts` and `contact.ts` (replaced below).

## Phase 2 — Database (Supabase / Lovable Cloud)
Migrations (one batch):
- `videos` table: id, title, youtube_id, youtube_url, thumbnail, category (brand/ad/corporate/animation/documentary), order_index, is_published, created_at, updated_at.
- `blog_posts` table: id, slug (unique), title, excerpt, content (markdown/html), cover_image, author, published_at, is_published, created_at, updated_at.
- `admin_users` table (or reuse `user_roles` per security guidance): admin role check via `has_role()` security-definer function.
- RLS: public read on published rows; admin-only insert/update/delete via `has_role(auth.uid(), 'admin')`.

Seed data:
- One-shot import: fetch all uploads from YouTube channel `@cynexproduction` (via `yt-dlp`) → insert into `videos` table tagged by category (initially all `brand`, admin re-categorizes).
- Migrate existing blog HTML pages → parse title/content from `public/site/*/index.html` for ~5 representative posts → insert into `blog_posts`.

## Phase 3 — 10 React routes
Convert each kept page from its static HTML into a React component, preserving classnames/markup so styling is identical. Pages:
1. `/` — Home (`public/site/index.html`)
2. `/about` — About
3. `/services` — Services landing
4. `/brand-videos` — was `brand-video-production-services-in-bangalore`
5. `/ad-films` — was `ad-films-maker-in-bangalore`
6. `/corporate` — was `avatar-corporate-films`
7. `/animation` — was `avatar-motion-graphics`, pulls videos from Supabase by category=animation
8. `/documentary` — was `documentary-film-maker-in-bangalore`
9. `/blog` + `/blog/$slug` — list & post pages, Supabase-backed
10. `/contact` — was `contact.html`, posts to `createServerFn` that emails via SMTP secret

Approach: keep the existing CSS/JS bundles in `public/site/wp-content/...` referenced from `<link>`/`<script>` in `__root.tsx` so styling carries over. Each route's JSX is the body markup of the original page minus header/footer (those become shared components).

Header & Footer become React components with proper `<Link>` nav, BHUMIT NASIT credit, social links.

Background/instant loading: TanStack Router prefetches links in viewport by default — enable `defaultPreload: 'intent'` and `defaultPreloadStaleTime` on the router. Use TanStack Query for video/blog data with stale-while-revalidate.

## Phase 4 — Admin (`/admin`)
- `/admin/login` — Supabase email+password auth.
- `_authenticated/admin` layout — guards via `has_role('admin')`.
- `/admin/videos` — table with add / edit / delete / reorder / toggle published / change category.
- `/admin/blog` — table with add / edit / delete / publish toggle. Editor: simple textarea + markdown render (no rich-text lib to keep scope tight).
- All mutations via `createServerFn` with `requireSupabaseAuth` middleware.

## Phase 5 — Verify
- Build passes.
- Each of the 10 routes renders.
- Admin login + a video edit + a blog add round-trip.
- Animation page lists Cynex YouTube videos.
- Old static `public/site/*.html` pages are gone.

---

## Heads-up / tradeoffs
- **Visual fidelity isn't 100% guaranteed.** Porting WordPress + Elementor markup to React preserves ~95% but some Elementor JS-driven animations/sliders may need manual fixes after first render. I'll fix what breaks.
- **Time/credit cost**: this is a large multi-step build. Expect several minutes of tool execution.
- **Blog migration**: I'll import ~5 representative posts as starter content; you can add more via admin. Importing all 200+ blog HTML pages cleanly into the DB isn't realistic without manual review.
- **Admin password**: I'll create the first admin user via a migration using your email. Tell me which email to grant admin to (or I'll use a placeholder you change in admin).

Reply **approve** to start, or tell me what to adjust.