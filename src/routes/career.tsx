import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/career")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Careers - CYNEX Production" },
      { name: "description", content: "&quot;Have queries or ideas? Contact CYNEX Production. Let&#039;s embark on a creative journey together!&quot; Drop us an email to sales@cynexproduction.in or call +91 +919662878413" },
      { property: "og:title", content: "Careers - CYNEX Production" },
      { property: "og:description", content: "&quot;Have queries or ideas? Contact CYNEX Production. Let&#039;s embark on a creative journey together!&quot; Drop us an email to sales@cynexproduction.in or call +91 +919662878413" },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/career/index.html" />;
}
