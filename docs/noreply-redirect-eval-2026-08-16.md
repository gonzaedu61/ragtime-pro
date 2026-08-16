# noreply@ Redirect + Dual-Mailbox Polling — Eval (2026-08-16)

## Feature

Previously `inbox-poll` only polled the `info@ragtime.pro` mailbox. Mail
sent to `noreply@ragtime.pro` (a send-only address, not meant to receive
anything) would just sit unread forever. This adds polling for a second,
genuinely separate mailbox (confirmed with the user — `noreply@` is not an
alias/forward into `info@`, it needs its own IMAP login), and for anything
that lands there, replies with a gentle redirect instead of attempting to
answer the message:

1. Explains `noreply@ragtime.pro` doesn't accept incoming mail and isn't
   monitored.
2. Points them to the site's chat widget for an interactive conversation,
   or the contact form / `info@ragtime.pro` for anything else.
3. If there's prior correspondence on file for that email address (from an
   earlier contact-form submission or direct email to `info@`), briefly and
   warmly acknowledges it, so they feel recognized rather than getting a
   generic bounce.

## Design

- **`inbox-poll/route.ts`** refactored around a `pollMailbox()` helper
  (IMAP connect/search/download/parse/flag-as-seen, previously inline) so
  the same loop-guard logic (skip blocklisted senders, skip
  auto-submitted/bounce messages) serves both mailboxes without
  duplication. Each mailbox gets its own `handleMessage` callback:
  `info@` → `sendAcknowledgement(..., channel: "email")` (existing
  behavior, unchanged); `noreply@` → `sendNoreplyRedirect(...)` (new).
  Each mailbox's poll runs in its own try/catch, so a failure on one
  (e.g. missing/invalid credentials) doesn't block the other — the
  response reports both independently: `{ info: {...}, noreply: {...} }`.
- **New IMAP credentials required**: `PURELYMAIL_IMAP_USER_NOREPLY` /
  `PURELYMAIL_IMAP_PASS_NOREPLY`, reusing the existing
  `PURELYMAIL_IMAP_HOST`/`PURELYMAIL_IMAP_PORT` (same server, different
  mailbox login) — documented in `.env.local.example`, **not yet set in
  Vercel**. Until they are, the `noreply` mailbox's poll will fail
  gracefully (reported as `{"error": "Poll failed"}`) without affecting the
  `info@` mailbox's polling.
- **`generateNoreplyRedirectReply(name, correspondence)`**
  (`src/lib/aiReply.ts`): a separate, simpler prompt from
  `generateAiReply()` — no RAG retrieval at all (hybridSearch/rerank
  skipped entirely), since the point is never to answer what was actually
  written to `noreply@`. Reuses the existing `buildCorrespondenceBlock()`
  and the same JSON contract (`personalizedReply`/`replySubject`) so it
  slots into the same send/HTML-formatting pipeline as the main reply path.
- **`sendNoreplyRedirect()`** (`src/lib/acknowledgement.ts`): mirrors
  `sendAcknowledgement()`'s structure (load context → generate → send →
  record), with its own fallback text for the API-failure path and its own
  fallback subject. Records the turn with `channel: "noreply"` — a new
  third value added to `EmailHistoryMessage.channel` alongside `"form"` and
  `"email"`, so future correspondence blocks can show "(via an email to
  noreply@ragtime.pro)" if that history ever gets surfaced again.

## Test method

Could not test the actual IMAP polling live — `noreply@`'s credentials
aren't provisioned yet, and even testing the `info@` side live risks acting
on real unread mail and sending real replies to real senders, which this
session deliberately avoided. Instead, tested `generateNoreplyRedirectReply()`
directly via a temporary debug route (no IMAP, no real email sent, route
removed after) — this is the actual new logic; the IMAP polling itself is a
mechanical refactor of already-verified code (same `pollMailbox` shape,
same loop-guards, same `client.download`/`simpleParser` flow as before).

## Transcript

**Case 1 — no prior correspondence on file:**

Input: name "Tom", message "Hi, I saw your website and wanted to ask about
pricing for the RAG solution."

> Hi Tom, thanks for reaching out. We just wanted to let you know that
> noreply@ragtime.pro doesn't accept incoming messages and isn't monitored
> by our team. If you'd like to chat, please visit https://www.ragtime.pro
> and click the chat icon, or use our contact form at
> https://www.ragtime.pro/contact, or email us directly at
> info@ragtime.pro. We look forward to connecting with you. The
> Ragtime-Pro Team

Correctly: no reference to any prior interest (there is none), doesn't
attempt to answer the pricing question, explains the address and redirects
to real channels.

**Case 2 — prior correspondence exists:**

Seeded a fake prior form-channel turn for a test address ("We are exploring
reasoning agents to help our ops team make faster restocking decisions...")
via `recordEmailTurn` directly, then sent a noreply-redirect test with a
vague follow-up ("Any update on my question?"):

> Hello Dana, thanks again for exploring reasoning agents to help your
> operations team make faster restocking decisions. We wanted to let you
> know that noreply@ragtime.pro doesn't accept incoming messages and isn't
> monitored by our team, but we'd be happy to chat further. If you'd like
> an interactive conversation, please visit https://www.ragtime.pro and
> click the chat icon, or reach out through our contact form at
> https://www.ragtime.pro/contact or email info@ragtime.pro directly. We
> look forward to connecting with you. The Ragtime-Pro Team

Correctly references the prior Reasoning Agents/restocking interest in one
warm sentence, without going into detail, then explains the noreply@
situation and redirects — and does **not** attempt to answer "Any update on
my question?" with a real answer, staying in redirect mode as intended.

## Outcome

Both scenarios behaved as intended. `npx tsc --noEmit` and `npm run lint`
clean on the final code.

## Cleanup

Test R2 records `email-history/tom.test@example.com.json` and
`email-history/dana.test@example.com.json` deleted after review. No real
email was sent, and the real IMAP mailboxes were never touched.

## Outstanding before this works in production

`PURELYMAIL_IMAP_USER_NOREPLY` and `PURELYMAIL_IMAP_PASS_NOREPLY` need to
be created in Purelymail (an IMAP login for the `noreply@ragtime.pro`
mailbox) and added to Vercel's environment variables (Production +
Preview, matching how the existing IMAP vars are scoped), the same way the
R2 credentials gap was closed earlier this session. Until then, the
`noreply` half of `inbox-poll`'s response will report `{"error": "Poll
failed"}` on every run — harmlessly, since it's isolated from the `info@`
mailbox's polling.
