export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const body = req.body || {};
  console.log("Contact form submission:", body);
  return res.json({ success: true, message: "Message sent successfully" });
}
