## Goal
1. Keep ~20 main pages of the static site, delete the rest.
2. Wrap each kept HTML page in a thin React/TSX route file (programmatic conversion via script — no AI rewriting of markup/styles). Visuals stay 100% identical because we serve the original HTML body inside the React shell.
3. Change admin password to `Cynex` and convert `public/site/admin/index.html` into a real TSX route.
4. Clean up unused scripts, JSON, and dead files.

## Pages to keep (20)
1. `/` → index.html
2. `/about` → about.html
3. `/contact` → contact.html
4. `/enquiry` → enquiry.html
5. `/blog` → blog.html
6. `/career` → career/index.html
7. `/brand-videos` → brand-video-production-services-in-bangalore/index.html
8. `/ad-films` → ad-films-maker-in-bangalore/index.html
9. `/corporate` → avatar-corporate-films/index.html
10. `/animation` → avatar-motion-graphics/index.html
11. `/documentary` → documentary-film-maker-in-bangalore/index.html
12. `/explainer-videos` → explainer-video-production-in-bangalore/index.html
13. `/music-videos` → music-video-production-services-in-bangalore.html
14. `/video-production` → video-production/index.html
15. `/creative-agency` → creative-agency-and-digital-agency/index.html
16. `/privacy-policy` → privacy-policy/index.html
17. `/terms` → terms-and-conditions/index.html
18. `/refund-policy` → refund-policy/index.html
19. `/cookie-policy` → cookie-policy/index.html
20. `/admin` → new TSX admin (replaces admin/index.html)

## Approach (no AI rewriting)
- Write a Node script `scripts/build-routes.mjs` that:
  - Reads each kept HTML file
  - Extracts `<head>` (title/meta) and `<body>` innerHTML
  - Emits a TSX file under `src/routes/<slug>.tsx` that:
    - Sets `head()` from extracted title/meta
    - Renders `<div dangerouslySetInnerHTML={{ __html: bodyHtml }} />` plus the original `<link>`/`<script>` tags injected via the route component
  - This preserves every pixel of styling because we keep the original WP/Elementor HTML+CSS+JS untouched.
- Keep `public/site/wp-content/...` assets so absolute paths in the HTML still resolve.
- Delete every other `public/site/*.html` page and orphan folders.

## Admin page
- Convert `public/site/admin/index.html` → `src/routes/admin.tsx` (TSX, same UI).
- Update password env: set `ADMIN_PASSWORD=Cynex` via secrets tool.
- Login posts to existing `/api/admin/login`; videos & blog managed via existing endpoints.
- Old `public/site/admin/index.html` deleted.

## Cleanup
Delete:
- All `public/site/*.html` and subfolders not in the keep-list (~180+ pages).
- `scratch/`, `scan-videos.js`, `scripts/debug-*.mjs`, `scripts/parse-yt-channel.mjs`, `scripts/inspect-yt-data.mjs`, `scripts/sweep-html-youtube-to-channel.mjs`, `channel-videos.json`, `database.json`, empty `data/videos.json`.
- Stale `video_overrides` table is ignored (data already migrated to `site_videos`).

## Verification
- Build passes.
- Each of the 20 routes renders identical to the previous static page.
- `/admin` loads, login with `Cynex` works, video/blog CRUD round-trips.
- Animation page shows YouTube videos from Supabase.

## Tradeoffs
- Pages are still the original WordPress/Elementor HTML — this is intentional ("don't change the look"). They are now served through TanStack routes, so navigation between them benefits from router preloading.
- No SSR-friendly React rewrite of the markup (would change visuals).

Reply **approve** to start.
