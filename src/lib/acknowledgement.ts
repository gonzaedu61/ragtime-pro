import transporter from "@/lib/mailer";
import { generateAiReply } from "@/lib/aiReply";

const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS!;
const INFO_ADDRESS = process.env.MAIL_INFO_ADDRESS!;
const FALLBACK_SUBJECT = "We've received your message — Ragtime-Pro";

interface AckFields {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  aiInterest?: string;
  message: string;
}

function fallbackText(name: string): string {
  return `Dear ${name},\n\nThank you for getting in touch with us — we appreciate your interest in exploring how AI could modernize your product. We'll review your message and get back to you shortly with the information you're looking for.\nWe hope the walkthrough on our site has been helpful in shaping your thinking around modernization. With a bit of luck, this first conversation becomes the start of something more meaningful.\n\n— The Ragtime-Pro Team`;
}

export async function sendAcknowledgement(fields: AckFields): Promise<void> {
  const aiReply = await generateAiReply(fields);

  await transporter.sendMail({
    from: `"Ragtime-Pro" <${FROM_ADDRESS}>`,
    to: fields.email,
    bcc: INFO_ADDRESS,
    subject: aiReply?.subject ?? FALLBACK_SUBJECT,
    text: aiReply?.text ?? fallbackText(fields.name),
  });
}
