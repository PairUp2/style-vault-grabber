import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/videos")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({ items: [] });
      },
    },
  },
});
