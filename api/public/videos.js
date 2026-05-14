import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return res.json({ items: [] });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("site_videos")
      .select("original_id, override_url, is_added, is_deleted, label, category");
    if (error) {
      console.error("[videos] fetch failed", error);
      return res.json({ items: [] });
    }
    const items = (data || []).map((v) => ({
      original_id: v.original_id,
      url: v.override_url,
      is_added: v.is_added,
      is_deleted: v.is_deleted,
      label: v.label || "",
      category: v.category,
    }));
    res.setHeader("cache-control", "public, max-age=30");
    return res.json({ items });
  } catch (e) {
    console.error("[videos] error", e);
    return res.json({ items: [] });
  }
}
