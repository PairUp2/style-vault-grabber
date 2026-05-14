import { createFileRoute } from "@tanstack/react-router";

const ADMIN_PASSWORD = "Cynex";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { password } = await request.json().catch(() => ({ password: "" }));
        if (password !== ADMIN_PASSWORD && password !== process.env.ADMIN_PASSWORD) {
          return Response.json({ success: false, error: "Invalid password" }, { status: 401 });
        }
        return Response.json({ success: true, token: password });
      },
    },
  },
});
