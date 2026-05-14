import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <iframe
      src="/site/enquiry.html"
      title="Ask your query - CYNEX Production"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
