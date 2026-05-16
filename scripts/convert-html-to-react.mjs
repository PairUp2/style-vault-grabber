#!/usr/bin/env node
/**
 * Build-time HTML → React conversion.
 * Reads each kept HTML file, extracts head <link>/<style>/<script> refs and
 * body innerHTML, and emits a TSX route that renders body via html-react-parser
 * (real React elements) plus a useEffect that injects head assets into <head>.
 *
 * Tooling: cheerio (HTML DOM) + html-react-parser (HTML → React elements).
 * No AI rewriting — pure deterministic conversion.
 */
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";

const ROOT = process.cwd();
const SITE = path.join(ROOT, "public/site");
const OUT = path.join(ROOT, "src/routes");

const PAGES = [
  { route: "/",                  file: "index.tsx",            html: "index.html" },
  { route: "/about",             file: "about.tsx",            html: "about.html" },
  { route: "/contact",           file: "contact.tsx",          html: "contact.html" },
  { route: "/enquiry",           file: "enquiry.tsx",          html: "enquiry.html" },
  { route: "/blog",              file: "blog.tsx",             html: "blog.html" },
  { route: "/career",            file: "career.tsx",           html: "career/index.html" },
  { route: "/brand-videos",      file: "brand-videos.tsx",     html: "brand-video-production-services-in-bangalore/index.html" },
  { route: "/ad-films",          file: "ad-films.tsx",         html: "ad-films-maker-in-bangalore/index.html" },
  { route: "/corporate",         file: "corporate.tsx",        html: "avatar-corporate-films/index.html" },
  { route: "/animation",         file: "animation.tsx",        html: "avatar-motion-graphics/index.html" },
  { route: "/documentary",       file: "documentary.tsx",      html: "documentary-film-maker-in-bangalore/index.html" },
  { route: "/explainer-videos",  file: "explainer-videos.tsx", html: "explainer-video-production-in-bangalore/index.html" },
  { route: "/music-videos",      file: "music-videos.tsx",     html: "music-video-production-services-in-bangalore.html" },
  { route: "/video-production",  file: "video-production.tsx", html: "video-production/index.html" },
  { route: "/creative-agency",   file: "creative-agency.tsx",  html: "creative-agency-and-digital-agency/index.html" },
  { route: "/privacy-policy",    file: "privacy-policy.tsx",   html: "privacy-policy/index.html" },
  { route: "/terms",             file: "terms.tsx",            html: "terms-and-conditions/index.html" },
  { route: "/refund-policy",     file: "refund-policy.tsx",    html: "refund-policy/index.html" },
  { route: "/cookie-policy",     file: "cookie-policy.tsx",    html: "cookie-policy/index.html" },
  { route: "/admin",             file: "admin.tsx",            html: "admin/index.html" },
  { route: "/video-production/video-production-company-in-hyderabad", file: "video-production.video-production-company-in-hyderabad.tsx", html: "video-production/video-production-company-in-hyderabad/index.html" },
  { route: "/video-production/video-production-company-in-mysore", file: "video-production.video-production-company-in-mysore.tsx", html: "video-production/video-production-company-in-mysore/index.html" },
  { route: "/video-production/video-production-company-in-pune", file: "video-production.video-production-company-in-pune.tsx", html: "video-production/video-production-company-in-pune/index.html" },
];

const ROUTE_ALIASES = {
  "/ad-films-maker-in-bangalore": "/ad-films",
  "/brand-video-production-services-in-bangalore": "/brand-videos",
  "/avatar-corporate-films": "/corporate",
  "/avatar-motion-graphics": "/animation",
  "/documentary-film-maker-in-bangalore": "/documentary",
  "/explainer-video-production-in-bangalore": "/explainer-videos",
  "/music-video-production-services-in-bangalore": "/music-videos",
  "/creative-agency-and-digital-agency": "/creative-agency",
  "/terms-and-conditions": "/terms",
  "/video-production/ad-films-maker-in-bangalore": "/ad-films",
  "/video-production/documentary-film-maker-in-bangalore": "/documentary",
  "/avatar-stock-footage-commercial": "/corporate",
  "/animation-video-makers-in-bangalore": "/animation",
  "/event-video-coverage-services-in-bangalore": "/video-production",
};

const esc = (s) => (s ?? "").replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const escAttr = (s) => (s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');

function rewriteUrl(u, baseDir) {
  if (!u) return u;
  if (/^(https?:|data:|mailto:|tel:|#|\/\/)/i.test(u)) return u;
  const match = u.match(/^([^?#]+)([?#].*)?$/);
  const rawPath = match?.[1] || u;
  const suffix = match?.[2] || "";
  const withoutSite = rawPath.startsWith("/site/") ? rawPath.slice(5) : rawPath;
  const absolutePath = withoutSite.startsWith("/")
    ? withoutSite
    : path.posix.normalize(path.posix.join("/", baseDir, withoutSite));
  const normalizedPagePath = absolutePath
    .replace(/\/index\.html$/i, "")
    .replace(/\.html?$/i, "")
    .replace(/\/$/, "") || "/";
  const alias = ROUTE_ALIASES[normalizedPagePath];
  if (alias) return `${alias}${suffix}`;
  if (u.startsWith("/site/")) return u;
  if (u.startsWith("/")) return "/site" + u;
  // relative
  const resolved = path.posix.normalize(path.posix.join("/site", baseDir, u));
  return resolved;
}

function convertOne(page) {
  const htmlPath = path.join(SITE, page.html);
  if (!fs.existsSync(htmlPath)) {
    console.warn("MISSING:", htmlPath);
    return;
  }
  const raw = fs.readFileSync(htmlPath, "utf8");
  const $ = load(raw, { decodeEntities: false });
  const baseDir = path.posix.dirname(page.html);

  // Meta
  const title = $("title").first().text().trim() || "CYNEX Production";
  const desc = $('meta[name="description"]').attr("content") || "";
  const ogTitle = $('meta[property="og:title"]').attr("content") || title;
  const ogDesc = $('meta[property="og:description"]').attr("content") || desc;

  // Collect head assets, rewrite urls
  const stylesheets = [];
  $('head link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) stylesheets.push(rewriteUrl(href, baseDir));
  });
  const inlineStyles = [];
  $("head style").each((_, el) => {
    inlineStyles.push($(el).html() || "");
  });
  const scripts = [];
  $("script").each((_, el) => {
    const src = $(el).attr("src");
    const content = $(el).html() || "";
    const isAsync = $(el).attr("async") !== undefined;
    const isDefer = $(el).attr("defer") !== undefined;
    const type = $(el).attr("type") || "";
    if (src) {
      scripts.push({ src: rewriteUrl(src, baseDir), async: isAsync, defer: isDefer, type });
    } else if (content.trim()) {
      scripts.push({ content, type });
    }
  });
  // Remove scripts from body so they don't double-render
  $("script").remove();

  // Rewrite all relative URLs in body so assets resolve
  const attrMap = [
    ["img", "src"], ["img", "data-src"], ["img", "srcset"],
    ["source", "src"], ["source", "srcset"],
    ["a", "href"], ["link", "href"],
    ["video", "src"], ["video", "poster"],
    ["iframe", "src"],
    ["form", "action"],
  ];
  for (const [tag, attr] of attrMap) {
    $(`${tag}[${attr}]`).each((_, el) => {
      const v = $(el).attr(attr);
      if (!v) return;
      if (attr === "srcset") {
        const newV = v.split(",").map((part) => {
          const trimmed = part.trim();
          const sp = trimmed.indexOf(" ");
          const url = sp === -1 ? trimmed : trimmed.slice(0, sp);
          const rest = sp === -1 ? "" : trimmed.slice(sp);
          return rewriteUrl(url, baseDir) + rest;
        }).join(", ");
        $(el).attr(attr, newV);
      } else {
        $(el).attr(attr, rewriteUrl(v, baseDir));
      }
    });
  }
  // Inline style background-image urls
  $("[style]").each((_, el) => {
    const s = $(el).attr("style") || "";
    const ns = s.replace(/url\((['"]?)([^'")]+)\1\)/g, (_, q, u) => `url(${q}${rewriteUrl(u, baseDir)}${q})`);
    if (ns !== s) $(el).attr("style", ns);
  });

  const bodyClass = $("body").attr("class") || "";
  const bodyHtml = $("body").html() || "";

  const componentName = page.file.replace(".tsx", "").replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase()) + "Page";

  const tsx = `// AUTO-GENERATED by scripts/convert-html-to-react.mjs from ${page.html}
// Do not edit by hand — re-run the script to regenerate.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import parse from "html-react-parser";

const STYLESHEETS: string[] = ${JSON.stringify(stylesheets, null, 2)};
const INLINE_STYLES: string[] = [${inlineStyles.map((s) => "`" + esc(s) + "`").join(",")}];
const SCRIPTS: Array<{ src?: string; content?: string; async?: boolean; defer?: boolean; type?: string }> = ${JSON.stringify(scripts, null, 2)};

const BODY_HTML = \`${esc(bodyHtml)}\`;
const BODY_CLASS = "${escAttr(bodyClass)}";

export const Route = createFileRoute("${page.route}")({
  component: ${componentName},
  head: () => ({
    meta: [
      { title: ${JSON.stringify(title)} },
      { name: "description", content: ${JSON.stringify(desc)} },
      { property: "og:title", content: ${JSON.stringify(ogTitle)} },
      { property: "og:description", content: ${JSON.stringify(ogDesc)} },
    ],
  }),
});

function ${componentName}() {
  useEffect(() => {
    const tag = "cynex-${page.file.replace(".tsx", "")}";
    const injected: Element[] = [];

    for (const href of STYLESHEETS) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      l.setAttribute("data-cynex", tag);
      document.head.appendChild(l);
      injected.push(l);
    }
    for (const css of INLINE_STYLES) {
      const s = document.createElement("style");
      s.textContent = css;
      s.setAttribute("data-cynex", tag);
      document.head.appendChild(s);
      injected.push(s);
    }
    for (const sc of SCRIPTS) {
      const s = document.createElement("script");
      if (sc.type) s.type = sc.type;
      if (sc.src) {
        s.src = sc.src;
        if (sc.async) s.async = true;
        if (sc.defer) s.defer = true;
      } else if (sc.content) {
        s.textContent = sc.content;
      }
      s.setAttribute("data-cynex", tag);
      document.body.appendChild(s);
      injected.push(s);
    }
    return () => {
      injected.forEach((el) => el.remove());
    };
  }, []);

  return <div className={BODY_CLASS}>{parse(BODY_HTML)}</div>;
}
`;

  fs.writeFileSync(path.join(OUT, page.file), tsx);
  console.log("wrote", page.file, `(${stylesheets.length} css, ${scripts.length} js, ${(bodyHtml.length / 1024).toFixed(1)}kb body)`);
}

for (const p of PAGES) convertOne(p);
console.log("\nDone. Converted", PAGES.length, "pages.");
