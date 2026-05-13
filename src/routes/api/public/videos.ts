import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/videos")({
  server: {
    handlers: {
      GET: async () => {
        const { data, error } = await supabaseAdmin
          .from("site_videos")
          .select("original_id, override_url, is_added, is_deleted, label, category");
        if (error) {
          console.error("[videos] fetch failed", error);
          return Response.json({ items: [] });
        }
        const items = (data || []).map((v) => ({
          original_id: v.original_id,
          url: v.override_url,
          is_added: v.is_added,
          is_deleted: v.is_deleted,
          label: v.label || "",
          category: v.category,
        }));
        return new Response(JSON.stringify({ items }), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "cache-control": "public, max-age=30",
          },
        });
      },
    },
  },
});
