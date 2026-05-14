import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Privacy Policy - CYNEX Production" },
      { name: "description", content: "Navigating digital with confidence. Learn how CYNEX Production prioritizes your privacy, detailing our protocols to keep your data secure" },
      { property: "og:title", content: "Privacy Policy - CYNEX Production" },
      { property: "og:description", content: "Navigating digital with confidence. Learn how CYNEX Production prioritizes your privacy, detailing our protocols to keep your data secure" },
    ],
  }),
});

function Page() {
  return (
    <iframe
      src="/site/privacy-policy/index.html"
      title="Privacy Policy - CYNEX Production"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
