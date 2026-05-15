import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/blog")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Blogs on Video Production, SEO, Branding, Website Design-CYNEX Production" },
      { name: "description", content: "Stay at the forefront of digital innovation. Explore cutting-edge insights from experts on video production, SEO &amp; brand design to shape your brand&#039;s destiny." },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/blog.html" />;
}
