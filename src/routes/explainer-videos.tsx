import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <iframe
      src="/site/explainer-video-production-in-bangalore/index.html"
      title="Explainer Video Production Agency in Bangalores"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
