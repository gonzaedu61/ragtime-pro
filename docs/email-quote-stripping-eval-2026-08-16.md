# Email Reply Quote-Stripping — Eval (2026-08-16)

## Reported issue

User tested the full flow live: submitted the contact form, received the
acknowledgement email (sent from `noreply@ragtime.pro`), replied directly to
that email via Yahoo Mail, and got back the correct "wrong address, please
use the site" redirect. But inspecting the resulting record in R2, the
*third* message (their reply to `noreply@`) contained not just their new
question but the **entire quoted original email**, including our own prior
AI-generated reply — as if they had typed our own message back to us.

Root cause: Yahoo (like virtually every mail client) appends the full
quoted original message when you hit "Reply" — `"On DATE, NAME <EMAIL>
wrote: > ..."` followed by the quoted body. `inbox-poll` was taking
`parsed.text` (the raw plain-text body) verbatim as "the message," with no
attempt to strip that quoted content. This affected **both** mailboxes
(`info@` too), not just the new `noreply@` feature — it just wasn't visible
until correspondence history started being persisted and inspected.

## Fix

- Added `email-reply-parser@2.3.9` (exact-pinned, zero required deps,
  ships its own TypeScript types, used in production at Crisp for ~1M
  inbound emails/day) — confirmed via `npm audit` and a lockfile diff that
  the 10 pre-existing high-severity vulnerabilities and the
  esbuild/sharp/unrs-resolver install-script warning are **unrelated**,
  already present in the project (`@huggingface/transformers`, `next`,
  `nodemailer`, `@typescript-eslint`) before this install — the lockfile
  diff added exactly one new package.
- `src/app/api/inbox-poll/route.ts`: new `extractMessageText(text,
  subject)` runs the raw body through `EmailReplyParser().read(text)
  .getVisibleText()`, falling back through raw text → subject → a fixed
  placeholder if the stripped result is empty (e.g. a reply that's pure
  quote, no new text). Replaces the previous `parsed.text || parsed.subject
  || "(no message body)"` at the single call site shared by both mailboxes.

## Test method

Tested `EmailReplyParser` directly via a temporary debug route (route
removed after) — first against a reconstructed sample matching the exact
Yahoo quote format from the bug report, then against the *actual* raw
content pulled live from the real R2 record for
`gonzaedu61@yahoo.com` (via `readEmailHistory`), to confirm the fix works
on the real data, not just a synthetic approximation.

## Transcript

**Reconstructed sample (Yahoo quote format):**

Input included `"On Sunday, August 16, 2026 at 04:41:50 PM GMT+2,
Ragtime-Pro <noreply@ragtime.pro> wrote:"` followed by the full quoted
prior reply. Output (`getVisibleText()`):

> Thanks for your prompt reply. It is not clear to me though, whether fully
> redevelop a new modern web UI keeping the underlying business logic is
> possible or not in Genero. Can AI help develop that interface?
> BR,Eduardo

Quote block fully stripped, new content preserved exactly.

**Real stored content** (`fullHistory[2]` for `gonzaedu61@yahoo.com`,
before the fix): 1218 characters — the new question, then the full quoted
original assistant reply, **including our own "This reply was generated
automatically by Ragtime-Pro's AI agent." disclosure footer** embedded
inside the quote. Running it through the same `getVisibleText()` call
produced the identical clean 2-line result as above.

## Existing production data cleanup

Per the user's request, retroactively cleaned the already-stored
`email-history/gonzaedu61@yahoo.com.json` record in R2 (real production
data, not test data): re-processed every `role: "user"` message in both
`history` and `fullHistory` through the same `getVisibleText()` cleaning
(assistant turns left untouched) and wrote the corrected record back. The
bloated `noreply`-channel turn now reads identically to the already-clean
`email`-channel turn sent shortly after with the same content, confirming
the fix. Verified via a temporary debug route (read → clean → write →
read-back to confirm), route removed after.

## Outcome

Fix verified against both a reconstructed sample and real production data.
Existing bloated record cleaned. `npx tsc --noEmit` and `npm run lint`
clean on the final code.
