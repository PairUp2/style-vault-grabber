import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { password } = await request.json().catch(() => ({ password: "" }));
        const expected = process.env.ADMIN_PASSWORD;
        if (!expected) {
          return Response.json(
            { success: false, error: "ADMIN_PASSWORD not configured" },
            { status: 500 },
          );
        }
        if (password !== expected) {
          return Response.json({ success: false, error: "Invalid password" }, { status: 401 });
        }
        return Response.json({ success: true, token: expected });
      },
    },
  },
});
