import { NextRequest, NextResponse, after } from "next/server";
import transporter from "@/lib/mailer";
import { sendAcknowledgement } from "@/lib/acknowledgement";
import { readSession } from "@/r2/readSession";
import { SESSION_COOKIE } from "@/rag/session";

const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS!;
const INFO_ADDRESS = process.env.MAIL_INFO_ADDRESS!;
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, company, email, phone, aiInterest, message } = body;

  if (!name || !company || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // If this browser already has a chat session (same rag_session cookie,
  // sent automatically since it's scoped to path "/api"), enrich the
  // acknowledgement with that conversation and link the two records
  // (scenario 2: chat -> same-session form submission). Cookie itself is
  // read here (synchronous, no R2 call), but the actual R2 read stays
  // inside after() with everything else slow, so the response is still
  // instant.
  const chatSessionId = request.cookies.get(SESSION_COOKIE)?.value ?? null;

  after(async () => {
    try {
      const chatSession = chatSessionId ? await readSession(chatSessionId) : null;

      await sendAcknowledgement({
        name,
        company,
        email,
        phone,
        aiInterest,
        message,
        channel: "form",
        chatSessionId: chatSession ? chatSessionId! : undefined,
        chatContext: chatSession ? { summary: chatSession.summary, history: chatSession.history } : null,
      });

      await transporter.sendMail({
        from: `"RAGnify Website" <${FROM_ADDRESS}>`,
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
