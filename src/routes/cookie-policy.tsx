import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cookie-policy")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Cookie Policy - CYNEX Production" },
      { name: "description", content: "CYNEX Production presents a transparent Cookie Policy for an informed and optimized browsing experience." },
      { property: "og:title", content: "Cookie Policy - CYNEX Production" },
      { property: "og:description", content: "CYNEX Production presents a transparent Cookie Policy for an informed and optimized browsing experience." },
    ],
  }),
});

function Page() {
  return (
    <iframe
      src="/site/cookie-policy/index.html"
      title="Cookie Policy - CYNEX Production"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
