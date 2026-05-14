import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_SRC = path.resolve(__dirname, "public/site");
const OUT_DIR = path.resolve(__dirname, "dist/vercel");

function injectRuntimeScript(html) {
  if (html.includes('src="/cynex-runtime.js"')) return html;
  return html.replace("</body>", '<script src="/cynex-runtime.js"></script></body>');
}

function fixAssetPaths(html) {
  return html
    .replace(/="\/site\//g, '="/')
    .replace(/="\/site"/g, '="/"')
    .replace(/'\/site\//g, "'/")
    .replace(/'\/site'/g, "'/'");
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
        content = injectRuntimeScript(content);
        content = fixAssetPaths(content);
      }
      fs.writeFileSync(destPath, content, "utf-8");
    }
  }
}

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

function generateSitemap(pages) {
  const domain = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "www.cynexproduction.in";
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function collectPages(dir, base) {
  const pages = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("wp-") || entry.name === "admin") continue;
    if (entry.isDirectory()) {
      pages.push(...collectPages(path.join(dir, entry.name), base ? `${base}/${entry.name}` : entry.name));
    } else if (entry.name.endsWith(".html")) {
      // For directory index pages, add directory path only
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

// Clean and create output
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// Copy all site files
copyDir(SITE_SRC, OUT_DIR);

// Copy cynex-runtime.js to output root
const runtimeSrc = path.resolve(__dirname, "public/cynex-runtime.js");
const runtimeDest = path.join(OUT_DIR, "cynex-runtime.js");
fs.copyFileSync(runtimeSrc, runtimeDest);

// Generate sitemap.xml from built files
const pages = collectPages(OUT_DIR, "");
const uniquePages = [...new Set(pages)];
const sitemap = generateSitemap(uniquePages);
fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), sitemap, "utf-8");

// Generate robots.txt with correct sitemap URL
const domain = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "www.cynexproduction.in";
const robots = `User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml
`;
fs.writeFileSync(path.join(OUT_DIR, "robots.txt"), robots, "utf-8");

console.log("✅ Vercel build complete:", OUT_DIR);
console.log("   Files:", fs.readdirSync(OUT_DIR, { recursive: true }).length);
console.log("   Sitemap: generated with", uniquePages.length, "pages");
