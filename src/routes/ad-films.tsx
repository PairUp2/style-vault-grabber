import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/ad-films")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Films Maker Agency in Rajkot &amp; Ahmedabad" },
      { name: "description", content: "Bring your stories to life with CYNEX Production, Rajkot &amp; Ahmedabad’s premier film-making agency. We turn concepts into cinematic experiences." },
      { property: "og:title", content: "Films Maker Agency in Rajkot &amp; Ahmedabad" },
      { property: "og:description", content: "Bring your stories to life with CYNEX Production, Rajkot &amp; Ahmedabad’s premier film-making agency. We turn concepts into cinematic experiences." },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/ad-films-maker-in-bangalore/index.html" />;
}
