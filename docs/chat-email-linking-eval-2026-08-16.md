# Chat ↔ Email/Form History Linking — Eval (2026-08-16)

## The problem

Reported by the user: they submitted the contact form, got the acknowledgement
email, replied to it (routed to the `noreply@` redirect), then followed that
redirect's advice to try the website chat — and had to re-explain everything
from scratch. The chat had no way to know about their prior form/email
correspondence.

Two scenarios were scoped for this pass (a third — an anonymous chat later
linked from an *unprompted* email arriving from a different device, with no
identifier ever captured during the chat — was deferred pending a product
decision about whether the chat should ever proactively ask for an email,
since there's no reliable privacy-safe way to correlate an anonymous chat
session to a later email without one):

1. **Chat → email history**: a chat visitor implies prior email/form
   contact; the assistant looks it up and folds it into the conversation.
2. **Chat → same-session form submission**: a visitor chats first, then
   submits the contact form in the same browser session; the two get
   linked automatically, and the form's email reply gets enriched with
   the chat conversation.

## Design

### Key architectural choice

Rather than tracking "did we just ask for identity info" with regex/state-
flag heuristics against free-form chat text, detection runs as a small
dedicated classifier LLM call each turn (only while unlinked) — the same
pattern already established for summarization (`summarizeSession`,
`src/rag/summarize.ts`). A single call analyzes the whole conversation so
far and returns structured JSON: whether to ask for identity info, and any
email/name/company already mentioned anywhere in the conversation. This
sidesteps needing to track *which* turn asked *what* — every turn while
unlinked, we just ask the model "does this conversation now have enough to
look something up."

### Schema (`src/r2/types.ts`)

- `SessionData` (chat): `linkedEmail?: string`, `pendingEmailLinkCandidate?: string`.
  Never both set at once. `pendingEmailLinkCandidate` is one-shot — cleared
  the very next turn regardless of outcome (confirmed → promoted to
  `linkedEmail`; denied/unclear → just dropped).
- `EmailHistoryData`: `name?: string`, `company?: string` (not previously
  persisted at all), `linkedSessionId?: string` (bidirectional with
  `SessionData.linkedEmail`).

### R2 layer (`src/r2/emailHistory.ts`)

- `writeEmailHistory()` now also writes `name`/`company` as R2 object
  **metadata** (not just in the body) — mirrors `findByFingerprint`'s
  existing pattern (`src/r2/findByFingerprint.ts`) exactly, so a
  name/company search can scan via cheap `HeadObject` calls instead of
  downloading every record's full body.
- New `findEmailHistoryByNameOrCompany({name?, company?})`: lists +
  head-scans the `email-history/` prefix, matches case-insensitively on
  whichever of name/company was actually provided (requiring *all*
  provided fields to match, for precision), returns the most recently
  active match if more than one.

### Business logic (`src/rag/emailHistory.ts`)

- `EmailContext` gained `name`, `company`, `linkedSessionId` (informational).
- `recordEmailTurn()` now **re-reads** the record right before writing
  (rather than trusting the `EmailContext` snapshot captured before the
  LLM call) for merging `name`/`company`/`linkedSessionId` — avoids
  silently dropping a value that could have changed since the context was
  loaded.
- New `findEmailHistoryByIdentity({email?, name?, company?})`: exact email
  first (authoritative), name/company scan as fallback.
- New `summarizeTopicHint(record)`: a short (~15-word), deliberately vague
  excerpt used for the "is this you?" confirm question — enough to jog a
  genuine visitor's memory without leaking real content to someone who
  guessed/typo'd their way to a match that isn't actually theirs.

### Shared prompt helper (`src/rag/prompts/correspondenceBlock.ts`, new)

`aiReply.ts`'s existing correspondence-block renderer was generalized
(`buildCorrespondenceText<M>`, generic over the message type) so it's
reused by three call sites instead of being duplicated: email replies
showing prior email correspondence (existing), chat showing prior email/
form correspondence (new), and email replies showing prior chat
correspondence (new, scenario 2).

### Detector (`src/rag/emailLinkDetector.ts`, new)

- `detectEmailLinkIntent(history, query)`: the classifier described above.
- `classifyIdentityConfirmation(reply)`: a second, narrower classifier that
  only runs for the one turn immediately after a candidate is presented -
  classifies the visitor's reply as `"confirm" | "deny" | "unclear"`.

### Orchestration (`src/rag/answer.ts`)

New `resolveEmailLink()`, called from `generateAnswer()` before building
the prompt (so a just-found match can still influence *this* turn's
answer, not just future ones):

1. Already linked → load and inject every turn, no re-detection.
2. Pending candidate → classify this turn as confirm/deny/unclear.
3. Neither → run the detector; a match found sets
   `pendingEmailLinkCandidate` and asks for confirmation; no match found
   says so honestly; a bare hint with no identity info yet asks for one.

The one-turn `emailLinkNote` instruction is deliberately positioned right
before the final user query in `buildAnswerMessages()` (same placement as
the existing `forceCta` instruction) — a this-turn-specific directive
needs maximum recency weight, not diluted by everything else already in
context.

### Scenario 2 (`contact/route.ts`, `acknowledgement.ts`, `aiReply.ts`)

`contact/route.ts` reads the `rag_session` cookie (already sent
automatically with the form POST, since it's scoped to path `/api`) and,
if a chat session exists, passes its `{summary, history}` into
`sendAcknowledgement()` as `chatContext`, which threads through to
`generateAiReply()` and gets rendered via the same shared correspondence
helper. After sending, both records get linked (`EmailHistoryData
.linkedSessionId`, `SessionData.linkedEmail`) — the R2 read for the chat
session stays inside the existing `after()` block along with everything
else slow, so the form's response is still instant.

## Test method

All tests ran against the real backend (`POST /api/rag/answer`,
`generateAiReply`/`recordEmailTurn` called directly for scenario 2) with
synthetic seeded data — no real email was sent (scenario 2's mail-send step
was skipped, mirroring the established pattern for testing
`sendAcknowledgement`-adjacent code all session). All test R2 records
(6 chat sessions, 2 email-history records) deleted after review via a
temporary debug route, removed after.

## Transcript

**Scenario 1, exact-email path:**
1. Baseline unrelated question (EU AI Act) — no linking triggered, confirmed clean.
2. "I already emailed you about this a while back..." → *"Could you share the email address you used when you reached out? If that's not convenient, your name and company will also help..."*
3. Provided the seeded test email → *"It looks like we received a message from sam.linktest@example.com about streamlining manual approval workflows in logistics—could you confirm that was your inquiry?"* — `pendingEmailLinkCandidate` correctly set, verified in R2.
4. "Yes, that's me!" → correctly linked (`linkedEmail` set in R2), and the reply addressed the visitor as "Sam" and referenced "shipment exception process" / "Intelligent Workflows approach" — none of which had been mentioned in *this* chat session at all, confirming injection worked.
5. Follow-up turn ("that workflow project we discussed") — `linkedEmail` persisted, correspondence still available, correctly answered about "shipment-exception workflows" without re-explanation.
6. Bidirectional link confirmed: the email-history record's `linkedSessionId` matched the chat's `sessionId`.

**Iteration needed** (same lesson as prior hallucination-fix passes this
session): the first attempt at combining a hint + email in one message
("I sent you an email before at sam.linktest@example.com...") caused the
model to ask for name/company instead of the expected direct yes/no
confirm — even though `pendingEmailLinkCandidate` was correctly set
server-side (confirming the *detection* worked; only the *prompt* for the
resulting confirm question was unreliable). Fixed by (a) adding a concrete
example of the desired phrasing to `emailLinkNote`, and (b) moving
`emailLinkNote`'s position in the prompt to right before the final query,
matching where `forceCta` already sits, for maximum recency weight.
Retested clean. A further pass fixed a related polish issue: the model was
quoting the topic hint verbatim (including an awkward mid-sentence cutoff)
instead of paraphrasing it naturally — fixed by explicitly instructing
"paraphrase... never quote the topic text verbatim" with a generic (not
hint-specific) example.

**Scenario 1, deny path:** re-ran the hint+email flow, then replied "No,
that wasn't me actually" to the confirm question → correctly did not link,
did not reference the found content, and offered to try different details.
Verified `linkedEmail`/`pendingEmailLinkCandidate` both stayed unset in R2.

**Scenario 1, name/company-only path:** hinted at prior contact with no
email offered, then "I don't remember the exact email, but our company is
Falcon Logistics" → correctly found the match via the metadata scan alone
and asked to confirm ("...about automating the manual approval steps in
your shipment exception process—does that sound right?"). Confirmed →
correctly linked to the right email address purely from the company match.

**Scenario 2:** built a chat conversation about a fictional 30-year-old
COBOL insurance-claims system wanting a RAG assistant, then simulated a
same-session form submission with a message that only said "Following up
on what I was just asking in the chat — can you send more details?" (no
specifics repeated). The generated email reply correctly detailed the RAG
Integration Blueprint process *specifically for the COBOL/insurance-claims
scenario* — confirming `chatContext` flowed through correctly. Bidirectional
link verified: `EmailHistoryData.linkedSessionId` matched the chat's
`sessionId`, and the chat `SessionData.linkedEmail` matched the submitted
email.

## Outcome

Both scenarios verified working end-to-end, including edge cases (deny,
no-match, name/company-only matching). `npx tsc --noEmit` and `npm run lint`
clean on the final code.

## Known limitations / follow-ups

- **Non-ASCII names in R2 metadata**: S3/R2 object metadata headers are
  technically restricted to US-ASCII per the HTTP spec; a name like "José"
  could behave unpredictably in the metadata-based scan. Not addressed now
  (low likelihood for this project's current audience); would need explicit
  encoding handling if it becomes a real issue.
- **Classifier cost**: `detectEmailLinkIntent` runs once per turn for as
  long as a chat session stays unlinked (skipped entirely once linked or
  while a candidate is pending). Acceptable at this project's scale but
  worth knowing if chat volume grows significantly.
- **Scenario 3 (anonymous chat → later unprompted email) remains
  unbuilt** — see the "Design" section above for why it's a genuinely
  different, harder problem than the other two.
