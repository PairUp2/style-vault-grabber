import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function checkAuth(request: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return (request.headers.get("x-admin-password") || "") === expected;
}

export const Route = createFileRoute("/api/admin/blog")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!checkAuth(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const { data, error } = await supabaseAdmin
          .from("blog_posts")
          .select("*")
          .order("published_at", { ascending: false });
        if (error) return Response.json({ error: error.message }, { status: 500 });
        return Response.json({ posts: data || [] });
      },
      POST: async ({ request }) => {
        if (!checkAuth(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const body = await request.json();
        const { id, action } = body || {};

        if (action === "delete") {
          if (!id) return Response.json({ error: "id required" }, { status: 400 });
          const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
          if (error) return Response.json({ error: error.message }, { status: 500 });
          return Response.json({ success: true });
        }

        const payload = {
          slug: body.slug,
          title: body.title,
          excerpt: body.excerpt || null,
          content: body.content || null,
          cover_image: body.cover_image || null,
          author: body.author || "CYNEX Production",
          is_published: body.is_published !== false,
        };

        if (id) {
          const { data, error } = await supabaseAdmin
            .from("blog_posts")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
          if (error) return Response.json({ error: error.message }, { status: 500 });
          return Response.json({ success: true, post: data });
        } else {
          if (!payload.slug || !payload.title) {
            return Response.json({ error: "slug and title required" }, { status: 400 });
          }
          const { data, error } = await supabaseAdmin
            .from("blog_posts")
            .insert(payload)
            .select()
            .single();
          if (error) return Response.json({ error: error.message }, { status: 500 });
          return Response.json({ success: true, post: data });
        }
      },
    },
  },
});
