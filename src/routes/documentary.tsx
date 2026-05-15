import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

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
  return <HtmlPage src="/site/documentary-film-maker-in-bangalore/index.html" />;
}
