import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        console.log("Contact form submission:", body);
        return Response.json({ success: true, message: "Message sent successfully" });
      },
    },
  },
});
