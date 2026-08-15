# RAG-Powered Contact/Email Reply — Eval (2026-08-15)

## The feature

`src/lib/aiReply.ts` previously generated the contact-form/direct-email
acknowledgement with a single LLM call, no retrieved context, and an
explicit instruction *not* to answer the visitor's actual question — only
to acknowledge it and say the team would follow up. This upgrades it to:

1. Run the same retrieval pipeline the chat widget uses (`hybridSearch` →
   `rerankCandidates`) against the visitor's message, so the reply can
   answer concretely when the knowledge base supports it, and honestly
   admit uncertainty rather than invent pricing/commitments when it
   doesn't — mirroring the chat's own anti-hallucination rules.
2. Include a link to a matching website page when there's a clear, specific
   match (drawn from `src/lib/pageDirectory.ts`'s full page list), and
   never force one when nothing genuinely fits.
3. Adapt the closing line by channel: contact-form submissions already give
   Ragtime-Pro the visitor's details expecting to be contacted, so the
   reply says the team will follow up directly; direct emails to
   info@ragtime.pro skip that structured lead capture, so the reply
   politely invites booking an introductory call instead.

## Implementation

- `src/lib/pageDirectory.ts`: added `getAllPages()`, returning every known
  page as `{ path, title, description }` (static pages + one entry per
  `SOLUTIONS` slug) for link-matching.
- `src/lib/aiReply.ts`: `ContactFields` gained a required
  `channel: "form" | "email"` field. `generateAiReply()` now calls
  `hybridSearch(message)` → `rerankCandidates(message, candidates)` before
  building the prompt, and the prompt includes both the reranked context
  and the full page list, with an explicit rule not to force a link.
- `src/lib/acknowledgement.ts`: `AckFields` also gained `channel`, passed
  straight through to `generateAiReply`.
- `POST /api/contact` passes `channel: "form"`. `GET /api/inbox-poll`'s
  `sendAcknowledgement()` call passes `channel: "email"`.

## Test method

Tested `generateAiReply()` directly via a temporary debug route
(`POST` body → function call → JSON response), removed immediately after —
**no email was actually sent** during this eval, since that would dispatch
real mail through the live Purelymail account.

## Transcript

**Test 1 — `channel: "form"`, a question with a clear page match:**

Input: name "Jane Doe", company "Acme Corp", aiInterest "RAG assistants",
message "We have years of internal documentation nobody can find. Can your
RAG solutions help our support team find answers faster?"

> Hi Jane,
>
> Thank you for reaching out to Ragtime-Pro and sharing the documentation
> challenges at Acme Corp. Our RAG solutions are designed exactly for
> scenarios like yours: we turn extensive, hard-to-search documents into an
> in-product knowledge assistant that your support team can query in
> natural language and get accurate, contextual answers in seconds. Using
> our Modernization Agent, we analyze and structure your documentation,
> clean up metadata, and embed the assistant directly into your support
> workflows. You can find more details about this capability here:
> https://www.ragtime.pro/solutions/rag-solutions.
>
> We'll review the information you provided and follow up with you
> directly via email soon to discuss how we can get your support team
> finding answers faster.
>
> Warm regards,
> The Ragtime-Pro Team

Subject: "Your question about RAG solutions for support"

Concrete, grounded answer; correctly links `/solutions/rag-solutions`;
form-channel closing says the team will follow up (no call-booking ask).

**Test 2 — same kind of question, `channel: "email"`:**

Input: name "Marco Rossi", message "Our support team wastes hours searching
through old manuals. Could RAG help with that?"

> Hello Marco,
>
> Thank you for reaching out and describing your support team's challenge.
> You're right that searching through old manuals can eat up hours every
> week. A Retrieval-Augmented Generation (RAG) solution can directly embed
> your existing documentation into the product, so support agents can
> simply ask natural-language questions and instantly receive accurate,
> contextual answers instead of digging through PDFs or file shares. We use
> our Modernization Agent to analyze and structure your manuals, then
> deliver a Product Knowledge Assistant that lives inside your application
> and dramatically reduces search time. You can see more about our RAG
> approach here: https://www.ragtime.pro/solutions/rag-solutions
>
> If you'd like to explore how this fits into your product roadmap and
> lowers your support costs, please book a brief introductory call at
> https://www.ragtime.pro/start. We'd love to help you get started.
>
> Warm regards,
> The Ragtime-Pro Team

Same grounded answer and link; email-channel closing correctly invites
booking a call at `/start` instead of saying "we'll follow up."

**Test 3 — off-topic/pricing question, no clear page match, `channel: "email"`:**

Input: name "Sam", message "Do you offer discounts for non-profits?"

> Hi Sam,
>
> Thank you for reaching out and for your interest in Ragtime-Pro. We
> appreciate the vital work that non-profit organizations do, and we'd be
> happy to explore how we can support your mission. While we don't list
> public discounts for non-profits on our website, we typically review each
> engagement individually to find a fair arrangement based on project scope
> and your specific needs. If you'd like, let's schedule a brief
> introductory call to discuss your goals and see what options might be
> available.
>
> You can book a time directly here: https://www.ragtime.pro/start
>
> I look forward to speaking with you.
>
> The Ragtime-Pro Team

No forced/irrelevant page link; honest "we don't list public discounts"
rather than inventing a discount policy or number; still invites a call
since the question is itself about pricing/engagement (email channel).

## Outcome

All three scenarios behaved as intended. `npx tsc --noEmit` and
`npm run lint` clean on the final code.

## Cleanup

No R2 or persistent test data was created by this eval (no session/mailbox
state touched) — nothing to clean up.
