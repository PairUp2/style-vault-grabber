import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/video-production")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Video Production company in Rajkot &amp; Ahmedabad, Production house in Rajkot &amp; Ahmedabad" },
      { name: "description", content: "Turn ideas into immersive visuals with Rajkot &amp; Ahmedabad" },
      { property: "og:title", content: "Video Production company in Rajkot &amp; Ahmedabad, Production house in Rajkot &amp; Ahmedabad" },
      { property: "og:description", content: "Turn ideas into immersive visuals with Rajkot &amp; Ahmedabad" },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/video-production/index.html" />;
}
