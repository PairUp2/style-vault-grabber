import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <iframe
      src="/site/video-production/index.html"
      title="Video Production company in Rajkot &amp; Ahmedabad, Production house in Rajkot &amp; Ahmedabad"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
