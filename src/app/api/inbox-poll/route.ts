import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { sendAcknowledgement } from "@/lib/acknowledgement";

export const maxDuration = 60;

const MAX_MESSAGES_PER_RUN = 10;

const ACK_BLOCKLIST = new Set(
  (process.env.MAIL_ACK_BLOCKLIST ?? "")
    .split(",")
    .map((addr) => addr.trim().toLowerCase())
    .filter(Boolean)
);

function isAuthorized(request: Request): boolean {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" && !!token && token === process.env.INBOX_POLL_SECRET;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = new ImapFlow({
    host: process.env.PURELYMAIL_IMAP_HOST!,
    port: Number(process.env.PURELYMAIL_IMAP_PORT ?? 993),
    secure: true,
    auth: {
      user: process.env.PURELYMAIL_IMAP_USER!,
      pass: process.env.PURELYMAIL_IMAP_PASS!,
    },
    logger: false,
  });

  let processed = 0;
  let acknowledged = 0;
  let skipped = 0;

  await client.connect();
  try {
    const lock = await client.getMailboxLock("INBOX");
    try {
      const uids = (await client.search({ seen: false }, { uid: true })) || [];
      const batch = uids.slice(0, MAX_MESSAGES_PER_RUN);

      for (const uid of batch) {
        processed++;

        const { content } = await client.download(String(uid), undefined, { uid: true });
        const parsed = await simpleParser(content);

        await client.messageFlagsAdd(uid, ["\\Seen"], { uid: true });

        const senderAddress = parsed.from?.value?.[0]?.address?.toLowerCase().trim();
        const autoSubmitted = parsed.headers.get("auto-submitted");

        if (
          !senderAddress ||
          ACK_BLOCKLIST.has(senderAddress) ||
          (typeof autoSubmitted === "string" && autoSubmitted.toLowerCase() !== "no")
        ) {
          console.log(`inbox-poll: skipping uid ${uid} (sender: ${senderAddress ?? "unknown"})`);
          skipped++;
          continue;
        }

        const senderName = parsed.from?.value?.[0]?.name?.trim() || senderAddress;

        await sendAcknowledgement({
          name: senderName,
          email: senderAddress,
          message: parsed.text || parsed.subject || "(no message body)",
          channel: "email",
        });
        acknowledged++;
      }
    } finally {
      lock.release();
    }
  } catch (error) {
    console.error("inbox-poll error:", error);
    return NextResponse.json({ error: "Poll failed" }, { status: 500 });
  } finally {
    await client.logout();
  }

  return NextResponse.json({ processed, acknowledged, skipped });
}
