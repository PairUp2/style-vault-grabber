import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/explainer-videos")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Explainer Video Production Agency in Bangalores" },
      { name: "description", content: "Simplify complex ideas with CYNEX Production, Rajkot &amp; Ahmedabad’s leading explainer video production agency, creating concise and engaging content." },
      { property: "og:title", content: "Explainer Video Production Agency in Bangalores" },
      { property: "og:description", content: "Simplify complex ideas with CYNEX Production, Rajkot &amp; Ahmedabad’s leading explainer video production agency, creating concise and engaging content." },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/explainer-video-production-in-bangalore/index.html" />;
}
