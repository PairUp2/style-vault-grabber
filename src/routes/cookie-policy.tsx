import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

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
  return <HtmlPage src="/site/cookie-policy/index.html" />;
}
