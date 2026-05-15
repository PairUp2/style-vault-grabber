import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/admin")({
  component: Page,
  head: () => ({
    meta: [
      { title: "CYNEX Admin" },
      { name: "description", content: "" },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/admin/index.html" />;
}
