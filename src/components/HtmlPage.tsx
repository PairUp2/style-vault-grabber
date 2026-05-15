import { useEffect, useRef, useState } from "react";

/**
 * Renders a static HTML file (from /public) inline inside the React app.
 * - Fetches the HTML
 * - Injects its <head> <link rel="stylesheet">, <style>, and <script> into document.head
 * - Renders <body> innerHTML inside a container
 * - Re-executes inline + external scripts so Elementor / jQuery wire up
 *
 * Replaces the previous <iframe> approach so navigation, scrolling, and SEO
 * behave like a real SPA route while preserving the original WordPress styles.
 */
export function HtmlPage({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.text())
      .then((text) => {
        if (cancelled) return;
        setHtml(text);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    if (!html || !containerRef.current) return;

    const doc = new DOMParser().parseFromString(html, "text/html");
    const injected: Element[] = [];
    const tag = (el: Element) => el.getAttribute("data-cynex-injected");

    // Inject stylesheets / inline styles from the source <head>
    doc.head.querySelectorAll("link[rel='stylesheet'], style").forEach((node) => {
      const clone = node.cloneNode(true) as Element;
      clone.setAttribute("data-cynex-injected", src);
      document.head.appendChild(clone);
      injected.push(clone);
    });

    // Inject body class onto container so body-scoped CSS still applies
    const bodyClass = doc.body.getAttribute("class") || "";
    if (containerRef.current) {
      containerRef.current.className = bodyClass;
      containerRef.current.innerHTML = doc.body.innerHTML;
    }

    // Re-execute scripts that were placed inside the body innerHTML.
    // innerHTML doesn't run <script> tags, so we manually clone+replace.
    const runScript = (oldScript: HTMLScriptElement) => {
      const s = document.createElement("script");
      for (const attr of Array.from(oldScript.attributes)) {
        s.setAttribute(attr.name, attr.value);
      }
      if (oldScript.textContent) s.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(s, oldScript);
      return s;
    };
    containerRef.current
      .querySelectorAll("script")
      .forEach((sc) => runScript(sc as HTMLScriptElement));

    // Also re-execute scripts that lived in the original <head>, in order
    doc.head.querySelectorAll("script").forEach((sc) => {
      const s = document.createElement("script");
      for (const attr of Array.from(sc.attributes)) {
        s.setAttribute(attr.name, attr.value);
      }
      if (sc.textContent) s.textContent = sc.textContent;
      s.setAttribute("data-cynex-injected", src);
      document.head.appendChild(s);
      injected.push(s);
    });

    return () => {
      injected.forEach((el) => {
        if (tag(el) === src) el.remove();
      });
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [html, src]);

  return <div ref={containerRef} data-cynex-html-page />;
}
