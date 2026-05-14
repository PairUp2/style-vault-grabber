import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_SRC = path.resolve(__dirname, "public/site");
const OUT_DIR = path.resolve(__dirname, "dist/vercel");

// ─── Build page map ───────────────────────────────────────────────────────────
function buildPageMap(dir, base) {
  const files = new Set();
  const dirs = new Set();
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("wp-") || entry.name === "admin") continue;
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (fs.existsSync(path.join(dir, entry.name, "index.html"))) {
        dirs.add(rel);
      }
      const sub = buildPageMap(path.join(dir, entry.name), rel);
      sub.files.forEach((f) => files.add(f));
      sub.dirs.forEach((d) => dirs.add(d));
    } else if (entry.name.endsWith(".html") && entry.name !== "index.html") {
      files.add(rel.replace(/\.html$/, ""));
    }
  }
  return { files, dirs };
}

const pageMap = buildPageMap(SITE_SRC, "");
// pageMap.files = ["about", "blog", "contact", "enquiry", "music-video-production-services-in-bangalore"]
// pageMap.dirs = ["ad-films-maker-in-bangalore", "avatar-corporate-films", ...]

// Special path overrides for navigation links that map to different paths
const PATH_OVERRIDES = {
  "video-production-company-in-bangalore": "video-production",
  "animation-video-makers-in-bangalore": "avatar-motion-graphics",
  "event-video-coverage-services-in-bangalore": "video-production",
  "avatar-stock-footage-commercial": "avatar-corporate-films",
  "avatar-case-study-save-thungabhadra": "about",
  "avatar-real-stories-harekrishnacharities": "about",
  "avatar-case-study-basil-woods": "about",
  "avatar-case-study-seonics": "about",
  "podcast-studios-bangalore": "video-production",
  "video-production/animation-video-makers-in-bangalore": "avatar-motion-graphics",
};

function resolvePagePath(rawPath) {
  const clean = rawPath.replace(/\.html$/, "").replace(/\/+$/, "");
  // If it's a flat file
  if (pageMap.files.has(clean)) return `/${clean}`;
  // If it's a directory
  if (pageMap.dirs.has(clean)) return `/${clean}/`;
  // Check overrides
  const override = PATH_OVERRIDES[clean];
  if (override) {
    if (pageMap.dirs.has(override)) return `/${override}/`;
    if (pageMap.files.has(override)) return `/${override}`;
  }
  return null; // page doesn't exist
}

// ─── HTML processing ──────────────────────────────────────────────────────────
function injectRuntimeScript(html) {
  if (html.includes('src="/cynex-runtime.js"')) return html;
  return html.replace("</body>", '<script src="/cynex-runtime.js"></script></body>');
}

function fixAssetPaths(html) {
  html = html
    .replace(/="\/site\//g, '="/')
    .replace(/="\/site"/g, '="/"')
    .replace(/'\/site\//g, "'/")
    .replace(/'\/site'/g, "'/'");
  // Fix srcset attribute (comma-separated URLs with widths)
  html = html.replace(/srcset="[^"]*\/site\/[^"]*"/g, (m) => m.replace(/\/site\//g, "/"));
  html = html.replace(/srcset='[^']*\/site\/[^']*'/g, (m) => m.replace(/\/site\//g, "/"));
  // Fix CSS url() references in inline styles and style blocks
  html = html.replace(/url\(\s*['"]?\/site\//g, "url(/");
  return html;
}

function injectFavicon(html) {
  if (html.includes('rel="icon"')) return html;
  return html.replace("</head>", '<link rel="icon" type="image/png" href="/favicon.ico"></head>');
}

function fixNavigationLinks(html) {
  // Fix <a href="/site/XXX"> links using page map
  return html.replace(/href="\/site\/([^"]+)"/g, (match, rawPath) => {
    const resolved = resolvePagePath(rawPath);
    if (resolved) return `href="${resolved}"`;
    return match; // keep as-is if we can't resolve (will hit 404 page)
  });
}

function processHtml(content) {
  content = injectRuntimeScript(content);
  content = injectFavicon(content);
  content = fixNavigationLinks(content); // must run before fixAssetPaths (needs /site/ prefix)
  content = fixAssetPaths(content);
  return content;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      let content = fs.readFileSync(srcPath, "utf-8");
      if (entry.name.endsWith(".html")) {
        content = processHtml(content);
      }
      fs.writeFileSync(destPath, content, "utf-8");
    }
  }
}

// ─── 404 page ─────────────────────────────────────────────────────────────────
function create404Page() {
  const style = `
    body{margin:0;padding:0;font-family:Poppins,Arial,sans-serif;background:#0f0f0f;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;}
    .c{padding:40px 20px;max-width:500px;}
    h1{font-size:120px;margin:0;color:#e50914;line-height:1;}
    h2{font-size:24px;margin:20px 0 10px;font-weight:400;}
    p{color:#999;margin:0 0 30px;font-size:16px;line-height:1.6;}
    a{display:inline-block;padding:14px 36px;background:#e50914;color:#fff;text-decoration:none;border-radius:30px;font-weight:600;font-size:15px;transition:background .3s;}
    a:hover{background:#ff1a1a;}
  `;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page Not Found - CYNEX Production</title><style>${style}</style></head><body><div class="c"><h1>404</h1><h2>Page Not Found</h2><p>The page you're looking for doesn't exist or has been moved.<br>Let's get you back on track.</p><a href="/">Go to Homepage</a></div></body></html>`;
}

// ─── Sitemap generation ───────────────────────────────────────────────────────
function getPagePriority(relativePath) {
  const name = relativePath.toLowerCase();
  if (name === "index.html" || name === "") return "1.0";
  if (name.includes("privacy") || name.includes("cookie") || name.includes("refund") || name.includes("terms")) return "0.3";
  return "0.8";
}

function getChangeFreq(relativePath) {
  const name = relativePath.toLowerCase();
  if (name === "index.html" || name === "" || name.includes("blog")) return "weekly";
  if (name.includes("privacy") || name.includes("cookie") || name.includes("refund") || name.includes("terms")) return "monthly";
  return "monthly";
}

function generateSitemap(pages, domain) {
  const protocol = domain.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${domain}`;
  const urls = pages
    .filter((p) => !p.startsWith("admin/") && !p.startsWith("wp-"))
    .map((p) => {
      const clean = p.replace(/\.html$/i, "").replace(/\\/g, "/");
      const urlPath = clean === "index" ? "" : clean.replace(/\/index$/, "/");
      return `  <url>
    <loc>${baseUrl}/${urlPath}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${getChangeFreq(p)}</changefreq>
    <priority>${getPagePriority(p)}</priority>
  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function collectPages(dir, base) {
  const pages = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("wp-") || entry.name === "admin") continue;
    if (entry.isDirectory()) {
      pages.push(...collectPages(path.join(dir, entry.name), base ? `${base}/${entry.name}` : entry.name));
    } else if (entry.name.endsWith(".html")) {
      if (entry.name === "index.html" && base) {
        pages.push(`${base}/`);
      } else {
        const relative = base ? `${base}/${entry.name}` : entry.name;
        pages.push(relative);
      }
    }
  }
  return pages;
}

// ─── Main build ───────────────────────────────────────────────────────────────
const domain = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "www.cynexproduction.in";

// Clean and create output
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// Copy all site files (HTML gets processed: runtime injection + path fixing + nav fixing)
copyDir(SITE_SRC, OUT_DIR);

// Copy cynex-runtime.js with path fixing
const runtimeSrc = path.resolve(__dirname, "public/cynex-runtime.js");
let runtimeJs = fs.readFileSync(runtimeSrc, "utf-8");
runtimeJs = runtimeJs.replace(/\/site\//g, "/"); // Fix hardcoded /site/ paths in JS
fs.writeFileSync(path.join(OUT_DIR, "cynex-runtime.js"), runtimeJs, "utf-8");

// Copy favicon to root
const faviconSrc = path.join(SITE_SRC, "wp-content/uploads/2023/03/favicon.png");
if (fs.existsSync(faviconSrc)) {
  fs.copyFileSync(faviconSrc, path.join(OUT_DIR, "favicon.ico"));
  console.log("   Favicon copied");
} else {
  console.warn("   ⚠ Favicon not found at", faviconSrc);
}

// Replace Google Fonts local CSS (broken WOFF2 paths) with CDN @import URLs
const fontCssDir = path.join(OUT_DIR, "wp-content/uploads/elementor/google-fonts/css");
const fontReplacements = {
  "nunitosans.css": "@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');\n",
  "poppins.css": "@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');\n",
  "nunito.css": "@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');\n",
};
for (const [file, content] of Object.entries(fontReplacements)) {
  const fp = path.join(fontCssDir, file);
  if (fs.existsSync(fp)) {
    fs.writeFileSync(fp, content, "utf-8");
    console.log("   Replaced font CSS:", file);
  } else {
    console.warn("   ⚠ Font CSS not found:", fp);
  }
}

// Write 404 page
fs.writeFileSync(path.join(OUT_DIR, "404.html"), create404Page(), "utf-8");

// Generate sitemap.xml
const pages = [...new Set(collectPages(OUT_DIR, ""))];
const sitemap = generateSitemap(pages, domain);
fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), sitemap, "utf-8");

// Generate robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml
`;
fs.writeFileSync(path.join(OUT_DIR, "robots.txt"), robots, "utf-8");

console.log("✅ Vercel build complete:", OUT_DIR);
console.log("   Files:", fs.readdirSync(OUT_DIR, { recursive: true }).length);
console.log("   Sitemap:", pages.length, "pages");
console.log("   Domain:", domain);
