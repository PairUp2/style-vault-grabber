import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [
      { title: "CYNEX Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function Admin() {
  return (
    <iframe
      src="/site/admin/index.html"
      title="CYNEX Admin"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
