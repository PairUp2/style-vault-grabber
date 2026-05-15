import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

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
  return <HtmlPage src="/site/privacy-policy/index.html" />;
}
