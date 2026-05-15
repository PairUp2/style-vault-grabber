import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/enquiry")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Ask your query - CYNEX Production" },
      { name: "description", content: "Got questions? Reach out to CYNEX Production, Rajkot & Ahmedabad’s leading video production agency. We’re here to assist with all your creative needs." },
      { property: "og:title", content: "Ask your query - CYNEX Production" },
      { property: "og:description", content: "Got questions? Reach out to CYNEX Production, Rajkot & Ahmedabad’s leading video production agency. We’re here to assist with all your creative needs." },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/enquiry.html" />;
}
