import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/animation")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Animation Video Maker Agency in Rajkot &amp; Ahmedabad" },
      { name: "description", content: "CYNEX Production, Rajkot &amp; Ahmedabad’s top animation video maker agency, delivers creative and captivating animations to bring your ideas to life." },
      { property: "og:title", content: "Animation Video Maker Agency in Rajkot &amp; Ahmedabad" },
      { property: "og:description", content: "CYNEX Production, Rajkot &amp; Ahmedabad’s top animation video maker agency, delivers creative and captivating animations to bring your ideas to life." },
    ],
  }),
});

function Page() {
  return (
    <iframe
      src="/site/avatar-motion-graphics/index.html"
      title="Animation Video Maker Agency in Rajkot &amp; Ahmedabad"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
