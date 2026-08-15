# RAG Reply Hallucination Fixes — Eval (2026-08-16)

## Reported issue

User asked (via the contact-form/email reply flow), "Are you available for
a call today?" and got back:

> We'd be happy to set up a 45–60 minute introductory call as soon as
> today, subject to consultant availability. The quickest way is to visit
> our Consultation Request form on the website, pick your preferred slot,
> and we'll confirm immediately. You can also email us directly at
> hello@ragtime-pro.com with your time windows, and we'll do our best to
> accommodate.

Two hallucinations: a fabricated "Consultation Request form" with a
time-slot picker (no such feature exists — the site has a plain contact
form, no scheduling UI), and a wrong email address/domain entirely
(`hello@ragtime-pro.com` vs. the real `info@ragtime.pro`). Also requested:
use first-person plural ("we") consistently rather than "I."

Confirmed via `grep` across `docs/RAG_Source_Docs/` and the website copy
export that neither "hello@ragtime" nor "time slot" appears anywhere in the
source data — these were pure model hallucinations, not a source-document
error to correct.

## Fix

Added to both prompts — `src/lib/aiReply.ts` (contact-form/email reply) and
`src/rag/prompts/answerPrompt.ts` (chat) — since both represent Ragtime-Pro's
voice and both could plausibly hallucinate the same way:

- First-person plural instruction ("we/our/us," never "I/me").
- A hard-fact block: the only real contact channels are the contact form
  (`{SITE_ORIGIN}/contact`) and `info@ragtime.pro`; explicitly no calendar,
  time-slot picker, real-time availability system, or automatic calendar
  invite exists.
- `SITE_ORIGIN` extracted to `src/lib/pageDirectory.ts` as a shared export
  (previously duplicated as a local constant in `aiReply.ts`) so both
  prompts reference the same value.

**This took three iterations, same lesson as the earlier page-awareness
fix** (`docs/rag-page-awareness-eval-2026-08-15.md`) — a plain negative
instruction doesn't reliably stick; a concrete example of the desired
phrasing does:

1. First pass (negative word list only: "never invent... a time-slot
   picker...") — fixed the wrong email, but the model then invented "you
   can book a slot directly at /start, and we'll send a calendar invite
   right away" — a different fabricated mechanism, just now attached to a
   real URL.
2. Second pass added a concrete before/after example ("say only... 'we'll
   coordinate a time that works for you,' never 'you can book a slot
   directly and we'll send a calendar invite'") — mostly fixed it, but the
   reply still said "book your introductory call directly at
   `https://www.ragtime.pro/start`," contradicting its own correct
   "we don't use automated scheduling" sentence earlier in the same reply.
3. **Root cause of pass 2's residual bug**: `CHANNEL_CLOSING_RULE.email`
   itself said "book an introductory call at `/start`" — and `/start` isn't
   even the right link. Checked `src/app/page.tsx`: the Home page's own
   "Book an Intro Call" CTA links to **`/contact`**, not `/start` (`/start`
   describes the 3-phase engagement process, not an action page). Fixed the
   closing rule to point at `/contact` and reworded to "invite them to get
   in touch... to arrange an introductory call... Do not say 'book' or
   imply the form schedules a specific time automatically." Third pass
   verified clean.

## Follow-up: "Book" → "Request" in the UI itself

Mid-fix, flagged that the Home page button literally says "Book an Intro
Call" — the same word that was priming the model toward implying a booking
mechanism. Changed to **"Request an Intro Call"** (`src/app/page.tsx`), and
aligned the same wording everywhere it appeared in LLM-facing text for
consistency: `pageDirectory.ts`'s `/contact` description, and two "book an
intro call" mentions in `answerPrompt.ts`'s system prompt.

## Test transcript

**Retest 1 (first pass, still buggy):**
> "...Alternatively, you can book a slot directly at
> https://www.ragtime.pro/start, and we'll send a calendar invite right
> away."

**Retest 2 (second pass, still buggy):**
> "...As we don't use automated scheduling, please reply with a few time
> slots that suit you, or fill out our contact form at
> https://www.ragtime.pro/contact... You're also very welcome to book your
> introductory call directly at https://www.ragtime.pro/start."

**Retest 3 (final, email channel) — clean:**
> Thank you for reaching out to us at Ragtime-Pro. We're always excited to
> discuss AI-driven modernization, and we'd be delighted to connect with
> you. To arrange an introductory call, please visit our contact form at
> https://www.ragtime.pro/contact and share a few time slots that work for
> you. Alternatively, you can reply here with your availability and we'll
> coordinate a time that fits our schedules. We'll do our best to
> accommodate you today if possible.

("share a few time slots that work for you" here means *the visitor's own*
availability, not a website feature — legitimate coordination language, not
a hallucination.)

**Regression checks (form channel):**
- Same scheduling question → "Our team will follow up shortly at
  jane@acme.example to coordinate a time that works for you." Correct
  (form channel never claims a booking mechanism either way).
- Previously-verified RAG Solutions grounded question → still correctly
  grounded and linked to `/solutions/rag-solutions`, first-person plural
  throughout, no regression.

**Chat widget** (`POST /api/rag/answer`, same question): "You can reach out
via our contact form or by emailing info@ragtime.pro, and we'll coordinate
a time that works for you." — used almost the exact example phrasing from
the prompt. Confirms the fix transfers correctly to the chat surface too.

## Test method

Contact/email-reply tests used `generateAiReply()` directly via a temporary
debug route (no real email sent, route removed after). Chat test used a
real session against `POST /api/rag/answer` (test session
`482aef09-8738-448a-ae4c-45a5e22c9fd3`, single exchange, deleted after
review per the project's R2 test-data hygiene policy).

## Outcome

All three reported issues fixed and verified on both surfaces (chat and
contact/email reply). `npx tsc --noEmit` and `npm run lint` clean on the
final code.
