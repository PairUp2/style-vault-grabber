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
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ posts: data || [] });
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const { id, action } = body;

    if (action === "delete") {
      if (!id) return res.status(400).json({ error: "id required" });
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
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
      const { data, error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true, post: data });
    }

    if (!payload.slug || !payload.title) {
      return res.status(400).json({ error: "slug and title required" });
    }
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(payload)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, post: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
