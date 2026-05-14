import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Agency Terms and Conditions-CYNEX Production" },
      { name: "description", content: "Outlining our commitments &amp; expectations. Before you engage, understand our standards. CYNEX Production - Terms &amp; Conditions detailed" },
      { property: "og:title", content: "Agency Terms and Conditions-CYNEX Production" },
      { property: "og:description", content: "Outlining our commitments &amp; expectations. Before you engage, understand our standards. CYNEX Production - Terms &amp; Conditions detailed" },
    ],
  }),
});

function Page() {
  return (
    <iframe
      src="/site/terms-and-conditions/index.html"
      title="Agency Terms and Conditions-CYNEX Production"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
