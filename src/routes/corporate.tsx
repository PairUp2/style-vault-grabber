import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/corporate")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Brand Video Production in Rajkot &amp; Ahmedabad" },
      { name: "description", content: "Elevate your brand with professional video production by CYNEX Production, Rajkot &amp; Ahmedabad’s trusted brand video production agency." },
      { property: "og:title", content: "Brand Video Production in Rajkot &amp; Ahmedabad" },
      { property: "og:description", content: "Elevate your brand with professional video production by CYNEX Production, Rajkot &amp; Ahmedabad’s trusted brand video production agency." },
    ],
  }),
});

function Page() {
  return (
    <iframe
      src="/site/avatar-corporate-films/index.html"
      title="Brand Video Production in Rajkot &amp; Ahmedabad"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
