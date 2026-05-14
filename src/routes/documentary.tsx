import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/documentary")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Documentary Film Maker Agency in Rajkot &amp; Ahmedabad" },
      { name: "description", content: "Tell compelling stories with CYNEX Production, Rajkot &amp; Ahmedabad’s leading documentary film-making agency, bringing real-life narratives to the screen." },
      { property: "og:title", content: "Documentary Film Maker Agency in Rajkot &amp; Ahmedabad" },
      { property: "og:description", content: "Tell compelling stories with CYNEX Production, Rajkot &amp; Ahmedabad’s leading documentary film-making agency, bringing real-life narratives to the screen." },
    ],
  }),
});

function Page() {
  return (
    <iframe
      src="/site/documentary-film-maker-in-bangalore/index.html"
      title="Documentary Film Maker Agency in Rajkot &amp; Ahmedabad"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
