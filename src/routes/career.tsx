import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <iframe
      src="/site/career/index.html"
      title="Careers - CYNEX Production"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
