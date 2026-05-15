import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/about")({
  component: Page,
  head: () => ({
    meta: [
      { title: "How it all began - About the team - CYNEX Production" },
      { name: "description", content: "Meet the minds behind CYNEX Production. Our" },
      { property: "og:title", content: "How it all began - About the team - CYNEX Production" },
      { property: "og:description", content: "Meet the minds behind CYNEX Production. Our" },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/about.html" />;
}
