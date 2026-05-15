import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/music-videos")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Music Video Production Agency in Rajkot &amp; Ahmedabad" },
      { name: "description", content: "Create stunning music videos with CYNEX Production, Rajkot &amp; Ahmedabad’s premier music video production agency, bringing your musical vision to life." },
      { property: "og:title", content: "Music Video Production Agency in Rajkot &amp; Ahmedabad" },
      { property: "og:description", content: "Create stunning music videos with CYNEX Production, Rajkot &amp; Ahmedabad’s premier music video production agency, bringing your musical vision to life." },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/music-video-production-services-in-bangalore.html" />;
}
