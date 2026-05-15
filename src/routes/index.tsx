import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Creative Agency in Rajkot & Ahmedabad, Production agencies" },
      { name: "description", content: "Discover CYNEX Production, a leading creative agency and production house in Rajkot & Ahmedabad, specializing in video production and branding." },
      { property: "og:title", content: "Creative Agency in Rajkot & Ahmedabad, Production agencies" },
      { property: "og:description", content: "Discover CYNEX Production, a leading creative agency and production house in Rajkot & Ahmedabad, specializing in video production and branding." },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/index.html" />;
}
