import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/creative-agency")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Creative Agency and Digital Agency - CYNEX Production" },
      { name: "description", content: "CYNEX Production - Video production company in Rajkot & Ahmedabad." },
      { property: "og:title", content: "Creative Agency and Digital Agency - CYNEX Production" },
      { property: "og:description", content: "CYNEX Production - Video production company in Rajkot & Ahmedabad." },
    ],
  }),
});

function Page() {
  return (
    <iframe
      src="/site/creative-agency-and-digital-agency/index.html"
      title="Creative Agency and Digital Agency - CYNEX Production"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
