export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { password } = req.body || {};
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Cynex";
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: password });
  }
  return res.status(401).json({ success: false, error: "Invalid password" });
}
