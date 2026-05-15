import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/animation")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Animation Video Maker Agency in Rajkot &amp; Ahmedabad" },
      { name: "description", content: "CYNEX Production, Rajkot &amp; Ahmedabad’s top animation video maker agency, delivers creative and captivating animations to bring your ideas to life." },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/avatar-motion-graphics/index.html" />;
}
