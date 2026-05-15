import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/brand-videos")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Brand Video Production in Rajkot &amp; Ahmedabad" },
      { name: "description", content: "Elevate your brand with professional video production by CYNEX Production, Rajkot &amp; Ahmedabad’s trusted brand video production agency." },
      { property: "og:title", content: "Brand Video Production in Rajkot &amp; Ahmedabad" },
      { property: "og:description", content: "Elevate your brand with professional video production by CYNEX Production, Rajkot &amp; Ahmedabad’s trusted brand video production agency." },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/brand-video-production-services-in-bangalore/index.html" />;
}
