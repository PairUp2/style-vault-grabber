import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Blogs on Video Production, SEO, Branding, Website Design-CYNEX Production" },
      { name: "description", content: "Stay at the forefront of digital innovation. Explore cutting-edge insights from experts on video production, SEO &amp; brand design to shape your brand&#039;s destiny." },
      { property: "og:title", content: "Blogs on Video Production, SEO, Branding, Website Design-CYNEX Production" },
      { property: "og:description", content: "Stay at the forefront of digital innovation. Explore cutting-edge insights from experts on video production, SEO &amp; brand design to shape your brand&#039;s destiny." },
    ],
  }),
});

function Page() {
  return (
    <iframe
      src="/site/blog.html"
      title="Blogs on Video Production, SEO, Branding, Website Design-CYNEX Production"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
