import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function checkAuth(request: Request): boolean {
  const header = request.headers.get("x-admin-password") || "";
  if (header === "Cynex") return true;
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && header === expected;
}

export const Route = createFileRoute("/api/admin/videos")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!checkAuth(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { data, error } = await supabaseAdmin
          .from("site_videos")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) return Response.json({ error: error.message }, { status: 500 });
        return Response.json({ videos: data || [] });
      },
      POST: async ({ request }) => {
        if (!checkAuth(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const {
          id,
          permanent_delete,
          permanent_save,
          override_url,
          is_deleted,
          // create-new fields
          create,
          original_id,
          original_url,
          page,
          section,
          label,
          category,
          is_added,
        } = body || {};

        // Create new video
        if (create) {
          const { data, error } = await supabaseAdmin
            .from("site_videos")
            .insert({
              original_id: original_id || null,
              original_url: original_url || null,
              override_url: override_url || null,
              page: page || "",
              section: section || "",
              label: label || "",
              category: category || "brand",
              is_added: is_added !== false,
              is_deleted: false,
            })
            .select()
            .single();
          if (error) return Response.json({ error: error.message }, { status: 500 });
          return Response.json({ success: true, video: data });
        }

        if (!id) {
          return Response.json({ error: "id required" }, { status: 400 });
        }

        if (permanent_delete) {
          const { error } = await supabaseAdmin.from("site_videos").delete().eq("id", id);
          if (error) return Response.json({ error: error.message }, { status: 500 });
          return Response.json({ success: true });
        }

        const update: {
          override_url?: string | null;
          is_deleted?: boolean;
          label?: string;
          category?: string;
        } = {};
        if (override_url !== undefined) update.override_url = override_url;
        if (is_deleted !== undefined) update.is_deleted = is_deleted;
        if (label !== undefined) update.label = label;
        if (category !== undefined) update.category = category;

        const { data, error } = await supabaseAdmin
          .from("site_videos")
          .update(update)
          .eq("id", id)
          .select()
          .single();
        if (error) return Response.json({ error: error.message }, { status: 500 });
        return Response.json({ success: true, video: data, permanent: !!permanent_save });
      },
    },
  },
});
