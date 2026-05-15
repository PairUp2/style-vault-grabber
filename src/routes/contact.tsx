import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "@/components/HtmlPage";

export const Route = createFileRoute("/contact")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Contact us - CYNEX Production" },
      { name: "description", content: "Contact CYNEX Production, Rajkot & Ahmedabad’s top creative agency, for expert video production, branding, and digital content services. Contact CYNEX Production, Rajkot & Ahmedabad’s top creative agency, for expert video production, branding, and digital content services." },
    ],
  }),
});

function Page() {
  return <HtmlPage src="/site/contact.html" />;
}
