import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <iframe
      src="/site/about.html"
      title="How it all began - About the team - CYNEX Production"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
