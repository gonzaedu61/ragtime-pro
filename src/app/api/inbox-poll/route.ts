import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { sendAcknowledgement, sendNoreplyRedirect } from "@/lib/acknowledgement";

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

interface MailboxStats {
  processed: number;
  acknowledged: number;
  skipped: number;
}

interface MailboxConfig {
  label: string;
  host: string;
  port: number;
  user: string;
  pass: string;
  // Different mailboxes need different reply behavior: the info@ inbox gets
  // the real RAG-grounded acknowledgement, noreply@ always gets the
  // "wrong address" redirect regardless of what was actually asked.
  handleMessage: (sender: { name: string; email: string }, messageBody: string) => Promise<void>;
}

async function pollMailbox(config: MailboxConfig): Promise<MailboxStats> {
  const client = new ImapFlow({
    host: config.host,
    port: config.port,
    secure: true,
    auth: { user: config.user, pass: config.pass },
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
          console.log(`inbox-poll[${config.label}]: skipping uid ${uid} (sender: ${senderAddress ?? "unknown"})`);
          skipped++;
          continue;
        }

        const senderName = parsed.from?.value?.[0]?.name?.trim() || senderAddress;

        await config.handleMessage(
          { name: senderName, email: senderAddress },
          parsed.text || parsed.subject || "(no message body)"
        );
        acknowledged++;
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }

  return { processed, acknowledged, skipped };
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const host = process.env.PURELYMAIL_IMAP_HOST!;
  const port = Number(process.env.PURELYMAIL_IMAP_PORT ?? 993);

  const mailboxes: MailboxConfig[] = [
    {
      label: "info",
      host,
      port,
      user: process.env.PURELYMAIL_IMAP_USER!,
      pass: process.env.PURELYMAIL_IMAP_PASS!,
      handleMessage: (sender, message) =>
        sendAcknowledgement({ name: sender.name, email: sender.email, message, channel: "email" }),
    },
    {
      label: "noreply",
      host,
      port,
      user: process.env.PURELYMAIL_IMAP_USER_NOREPLY!,
      pass: process.env.PURELYMAIL_IMAP_PASS_NOREPLY!,
      handleMessage: (sender, message) => sendNoreplyRedirect({ name: sender.name, email: sender.email, message }),
    },
  ];

  const results: Record<string, MailboxStats | { error: string }> = {};

  for (const mailbox of mailboxes) {
    try {
      results[mailbox.label] = await pollMailbox(mailbox);
    } catch (error) {
      console.error(`inbox-poll[${mailbox.label}] error:`, error);
      results[mailbox.label] = { error: "Poll failed" };
    }
  }

  return NextResponse.json(results);
}
