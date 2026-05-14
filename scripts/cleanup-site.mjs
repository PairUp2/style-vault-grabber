// Delete every public/site entry not in the keep-list. Preserves wp-content,
// wp-includes, wp-json, admin, and the 19 kept page paths.
import fs from "node:fs";
import path from "node:path";

const KEEP = new Set([
  "wp-content",
  "wp-includes",
  "wp-json",
  "admin",
  // kept pages
  "index.html",
  "about.html",
  "contact.html",
  "enquiry.html",
  "blog.html",
  "career",
  "brand-video-production-services-in-bangalore",
  "ad-films-maker-in-bangalore",
  "avatar-corporate-films",
  "avatar-motion-graphics",
  "documentary-film-maker-in-bangalore",
  "explainer-video-production-in-bangalore",
  "music-video-production-services-in-bangalore.html",
  "video-production",
  "creative-agency-and-digital-agency",
  "privacy-policy",
  "terms-and-conditions",
  "refund-policy",
  "cookie-policy",
  // common assets/feeds we keep
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

const root = "public/site";
let deleted = 0;
for (const entry of fs.readdirSync(root)) {
  if (KEEP.has(entry)) continue;
  const p = path.join(root, entry);
  fs.rmSync(p, { recursive: true, force: true });
  deleted++;
}
console.log("deleted entries:", deleted);
