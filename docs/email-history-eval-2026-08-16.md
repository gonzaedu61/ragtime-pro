# Email Correspondence History — Eval (2026-08-16)

## Feature

Contact-form and direct-email replies previously had no memory of prior
correspondence — every message was answered in isolation, even from a
visitor who had written in before. This adds the same
`history`/`summary`/`fullHistory` pattern already built for the chat
widget (`docs/rag-page-awareness-eval-2026-08-15.md`,
`docs/rag-history-pagination-eval-2026-08-15.md`), keyed by the sender's
email address instead of a session cookie.

## Design

- **`EmailHistoryData`** (`src/r2/types.ts`): `{ email, history, summary,
  fullHistory, lastSeen }` — same shape as chat's `SessionData`. `email` is
  normalized (lowercased, trimmed) and used directly as the R2 key.
- **`EmailHistoryMessage`**: `SessionMessage` + optional `channel: "form" |
  "email"`, set only on `"user"` turns (our replies always go out by email
  regardless of which channel the visitor used, so they don't need one).
- **Storage** (`src/r2/emailHistory.ts`): same R2 bucket as chat sessions,
  new prefix `email-history/` (`src/r2/client.ts`'s `EMAIL_HISTORY_PREFIX`).
- **Summarization**: `shouldSummarize`/`summarizeSession`
  (`src/rag/summarize.ts`) were generalized to a generic `<M extends
  SessionMessage>` instead of hardcoding `SessionData`, so the same
  threshold logic (>20 messages or >1500 tokens, retaining the last 4)
  serves both chat and email without duplicating it. Existing call site in
  `src/rag/answer.ts` needed no changes — `SessionData` still satisfies the
  narrower `{ summary, history }` shape structurally.
- **`src/rag/emailHistory.ts`**: `loadEmailContext(email)` reads existing
  history and summarizes *before* returning, mirroring exactly how
  `generateAnswer()` (chat) summarizes before building the current turn's
  prompt — so the value used for this turn's prompt and the value written
  back afterward are the same, decided once. `recordEmailTurn(context,
  message, channel, reply)` appends the new turn to both `history` and
  `fullHistory` and writes back.
- **`acknowledgement.ts`** orchestrates: `loadEmailContext` → generate reply
  → send → `recordEmailTurn` — recorded even on the fallback-text path
  (API failure), since that's what was actually sent and the history should
  stay accurate to reality.
- **`aiReply.ts`**: new `buildCorrespondenceBlock()` renders the summary (if
  any) plus recent turns as text, each visitor line tagged `(via contact
  form)` / `(via direct email)`, appended into the existing single-prompt
  design alongside the RAG-context and page-list blocks.

## Test method

Tested the real orchestration end-to-end via a temporary debug route that
called `loadEmailContext` → `generateAiReply` → `recordEmailTurn` directly
(same functions `sendAcknowledgement` calls), skipping only
`transporter.sendMail` so no real email went out. Route removed after
testing; test R2 record deleted after review (see Cleanup).

## Transcript

Test address: `priya.test@example.com` (fictitious, used only for this
test).

**Turn 1 — form channel, first-ever message from this address:**

Input: "We have years of internal documentation nobody can find. Can your
RAG solutions help our support team find answers faster?"

`contextUsed.history.length` = 0 (confirmed empty on first contact, no
correspondence block would have been added to the prompt).

> Hello Priya,
>
> Thank you for reaching out to us at Ragtime-Pro and sharing details about
> Nimbus Systems' internal documentation challenges. We design RAG
> solutions precisely to unlock years of buried knowledge and make it
> instantly accessible to your support team. [...] You can find more about
> how we transform documentation into a living knowledge assistant on our
> website: https://www.ragtime.pro/solutions/rag-solutions
>
> We'll follow up with you directly soon using the details you provided to
> discuss your requirements and next steps.
>
> The Ragtime-Pro Team

`stored.fullHistory.length` = 2 after this turn (correctly recorded).

**Turn 2 — same address, direct-email channel, vague follow-up:**

Input: "Following up on my earlier message about our documentation search
problem - roughly how long would that RAG integration typically take?"

The reply correctly answered the specific follow-up (project-duration
factors, referencing "our Modernization Agent" and "RAG Integration
Blueprint" from turn 1) without needing the topic restated — confirming the
correspondence block worked. `contextUsed.history[0].channel` = `"form"`
(correctly carried over from turn 1). Closing correctly used the
email-channel wording (`/contact`, no "book"). No specific timeline number
was invented — correctly said it depends on documentation volume/structure
and offered a tailored estimate after review.

**Turn 3 — same address, triggering summarization:**

Temporarily lowered `MAX_HISTORY_LENGTH` from 20 to 2 in
`src/rag/summarize.ts` to trigger summarization without needing 20 real
turns (reverted immediately after this test). Input: "Thanks. One more
question - do you support multiple languages?"

`contextUsed.summary` came back non-empty and accurate:

> Priya from Nimbus Systems asked whether Ragtime-Pro's retrieval-augmented
> generation (RAG) solution can help her support team find answers in
> years of buried internal documentation. Ragtime-Pro explained that their
> Modernization Agent analyzes, cleans, and structures content, then embeds
> a RAG assistant into existing workflows and delivers a RAG Integration
> Blueprint for seamless, compliant integration. When asked about typical
> timelines, Ragtime-Pro noted that project duration varies based on
> documentation volume, structure, cleanup requirements, and integration
> points. They committed to produce a tailored estimate after reviewing
> Nimbus Systems' specific requirements and document readiness, and invited
> Priya to schedule a detailed discussion via their contact form.

`stored.history.length` = 6 (post-summarize trim to last 4, plus this
turn's 2 new messages — exactly the same growth pattern already verified
for chat's `history` field). `stored.fullHistory.length` = 6 (nothing
trimmed yet, correct — only 3 turns in, no eviction ever happens on this
field).

## Outcome

All three scenarios behaved as intended: empty context on first contact,
correct continuity (including channel attribution) on a vague follow-up,
and correct summarization behavior identical in shape to the already-shipped
chat feature. `npx tsc --noEmit` and `npm run lint` clean on the final code.

## Cleanup

Test R2 record `email-history/priya.test@example.com.json` deleted after
review. No real email was sent during this eval.
