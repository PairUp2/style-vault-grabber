import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ad-films")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Films Maker Agency in Rajkot &amp; Ahmedabad" },
      { name: "description", content: "Bring your stories to life with CYNEX Production, Rajkot &amp; Ahmedabad’s premier film-making agency. We turn concepts into cinematic experiences." },
      { property: "og:title", content: "Films Maker Agency in Rajkot &amp; Ahmedabad" },
      { property: "og:description", content: "Bring your stories to life with CYNEX Production, Rajkot &amp; Ahmedabad’s premier film-making agency. We turn concepts into cinematic experiences." },
    ],
  }),
});

function Page() {
  return (
    <iframe
      src="/site/ad-films-maker-in-bangalore/index.html"
      title="Films Maker Agency in Rajkot &amp; Ahmedabad"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
