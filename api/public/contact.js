import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "Cynexproduction7@gmail.com",
    pass: "azkq pryu smqh reio",
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const body = req.body || {};
  try {
    const info = await transporter.sendMail({
      from: `"${body.name || "Website Visitor"}" <Cynexproduction7@gmail.com>`,
      to: "Cynexproduction7@gmail.com",
      replyTo: body.email || undefined,
      subject: body.subject || "Website Enquiry",
      html: [
        "<h3>New Contact Form Submission</h3>",
        "<table style='border-collapse:collapse;width:100%'>",
        "<tr><td style='padding:8px;font-weight:bold'>Name:</td><td style='padding:8px'>" + (body.name || "Not provided") + "</td></tr>",
        "<tr><td style='padding:8px;font-weight:bold'>Email:</td><td style='padding:8px'>" + (body.email || "Not provided") + "</td></tr>",
        "<tr><td style='padding:8px;font-weight:bold'>Phone:</td><td style='padding:8px'>" + (body.phone || "Not provided") + "</td></tr>",
        "<tr><td style='padding:8px;font-weight:bold'>Subject:</td><td style='padding:8px'>" + (body.subject || "Not provided") + "</td></tr>",
        "<tr><td style='padding:8px;font-weight:bold'>Source:</td><td style='padding:8px'>" + (body.source || "website") + "</td></tr>",
        "</table>",
        "<hr>",
        "<p><strong>Message:</strong></p>",
        "<p>" + (body.message || "No message") + "</p>",
      ].join("\n"),
    });
    console.log("Email sent:", info.messageId);
    return res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(200).json({ success: false, error: "Failed to send message. Please try again." });
  }
}
