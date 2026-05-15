import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/refund-policy")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Refund Policy - CYNEX Production" },
      { name: "description", content: "Looking to rent a studio space at CYNEX Production? Read our clear and straightforward refund policy for all studio rental bookings." },
      { property: "og:title", content: "Refund Policy - CYNEX Production" },
      { property: "og:description", content: "Looking to rent a studio space at CYNEX Production? Read our clear and straightforward refund policy for all studio rental bookings." },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/refund-policy/index.html" />;
}
