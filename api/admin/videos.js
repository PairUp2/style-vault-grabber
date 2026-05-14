import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function checkAuth(req) {
  const pw = req.headers["x-admin-password"] || "";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Cynex";
  return pw === ADMIN_PASSWORD;
}

export default async function handler(req, res) {
  if (!checkAuth(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({ error: "Database not configured" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("site_videos")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ videos: data || [] });
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const { id, permanent_delete, create, override_url, is_deleted, label, category, original_id, original_url, is_added } = body;

    if (create) {
      const { data, error } = await supabase
        .from("site_videos")
        .insert({
          original_id: original_id || null,
          original_url: original_url || null,
          override_url: override_url || null,
          page: body.page || "",
          section: body.section || "",
          label: label || "",
          category: category || "brand",
          is_added: is_added !== false,
          is_deleted: false,
        })
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true, video: data });
    }

    if (!id) {
      return res.status(400).json({ error: "id required" });
    }

    if (permanent_delete) {
      const { error } = await supabase.from("site_videos").delete().eq("id", id);
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
    }

    const update = {};
    if (override_url !== undefined) update.override_url = override_url;
    if (is_deleted !== undefined) update.is_deleted = is_deleted;
    if (label !== undefined) update.label = label;
    if (category !== undefined) update.category = category;

    const { data, error } = await supabase
      .from("site_videos")
      .update(update)
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, video: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
