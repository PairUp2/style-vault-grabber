import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Contact us - CYNEX Production" },
      { name: "description", content: "Contact CYNEX Production, Rajkot & Ahmedabad’s top creative agency, for expert video production, branding, and digital content services. Contact CYNEX Production, Rajkot & Ahmedabad’s top creative agency, for expert video production, branding, and digital content services." },
      { property: "og:title", content: "Contact us - CYNEX Production" },
      { property: "og:description", content: "Contact CYNEX Production, Rajkot & Ahmedabad’s top creative agency, for expert video production, branding, and digital content services. Contact CYNEX Production, Rajkot & Ahmedabad’s top creative agency, for expert video production, branding, and digital content services." },
    ],
  }),
});

function Page() {
  return (
    <iframe
      src="/site/contact.html"
      title="Contact us - CYNEX Production"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
