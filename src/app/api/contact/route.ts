import { NextResponse, after } from "next/server";
import transporter from "@/lib/mailer";
import { sendAcknowledgement } from "@/lib/acknowledgement";

const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS!;
const INFO_ADDRESS = process.env.MAIL_INFO_ADDRESS!;
export const maxDuration = 30;

export async function POST(request: Request) {
  const body = await request.json();
  const { name, company, email, phone, aiInterest, message } = body;

  if (!name || !company || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  after(async () => {
    try {
      await sendAcknowledgement({ name, company, email, phone, aiInterest, message });

      await transporter.sendMail({
        from: `"Ragtime-Pro Website" <${FROM_ADDRESS}>`,
        to: INFO_ADDRESS,
        replyTo: email,
        subject: `New contact form submission from ${name}`,
        text: [
          `Name: ${name}`,
          `Company: ${company}`,
          `Email: ${email}`,
          `Phone: ${phone || "—"}`,
          `AI Modernization Interest: ${aiInterest || "—"}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      });
    } catch (error) {
      console.error("Contact form email error:", error);
    }
  });

  return NextResponse.json({ success: true });
}
