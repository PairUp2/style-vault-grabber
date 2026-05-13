import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "CYNEX Production - Video Production Company in Rajkot & Ahmedabad" },
      {
        name: "description",
        content:
          "CYNEX Production is a leading video production company in Rajkot & Ahmedabad offering brand films, ad films, corporate videos, and more.",
      },
    ],
  }),
});

function Home() {
  return (
    <iframe
      src="/site/index.html"
      title="CYNEX Production"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: 0,
      }}
    />
  );
}
