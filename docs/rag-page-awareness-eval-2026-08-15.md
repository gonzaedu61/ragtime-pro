# RAG Chat Page Awareness — Eval (2026-08-15)

## The reported issue

User asked the chat "What's in this page?" while on the Personal
Productivity solution page. The answer:
1. Named "Personal Productivity" as the current page — correctly by
   coincidence, but the backend had **no actual signal** for what page
   the visitor was on. Nothing in the frontend or backend ever passed
   page context; the model inferred it from conversation history, which
   would misfire on any page it hadn't already discussed.
2. Described the page as a UI document — H1, pull-quote, sidebar nav,
   four info cards, a CTA button — none of which the model has any way
   of actually knowing, since retrieval only returns text content, never
   layout/DOM.

## Fix

- **`src/lib/pageDirectory.ts`** (new): maps known routes to
  `{ title, description }`. Static pages are hand-written; `/solutions/[slug]`
  pages are derived from `SOLUTIONS` (`src/lib/solutions.ts`) automatically
  rather than duplicated. `getPageContext(pathname)` returns `null` for
  anything unmapped.
- **`ChatWidget.tsx`**: reads the current route via `usePathname()` (re-renders
  on navigation even though the widget itself never unmounts) and sends it as
  `pagePath` with every `POST /api/rag/answer` call.
- **`POST /api/rag/answer`**: accepts optional `pagePath`, forwards it to
  `generateAnswer`.
- **`generateAnswer` (`src/rag/answer.ts`)**: resolves `pagePath` to a
  `PageContext` via `getPageContext`. When resolved, the *retrieval* query
  (not the literal user-facing query) is biased with the page's title +
  description, so topic-less questions like "what's on this page?" actually
  retrieve the right chunks instead of relying on conversation-history
  bleed-through.
- **`buildAnswerMessages` (`src/rag/prompts/answerPrompt.ts`)**: when
  `pageContext` is resolved, injects a labeled `Current page: "X" — Y` system
  message. The system prompt now explicitly says: only use that labeled note
  to answer "what page am I on" questions, never infer it from anything else,
  and say honestly when it's missing.
- System prompt also now forbids describing pages as documents/artifacts at
  all (no "this page," "this material," "card," "sidebar," "pull-quote,"
  "call to action," "you'll find," table-of-contents-style answers) and
  requires answering the underlying topic directly, as if the visitor had
  asked about the topic by name.

## Prompt iteration (three passes were needed)

1. First pass (page-identity fix only) — correctly stopped hallucinating the
   page name, but with real page context supplied, the answer *still*
   narrated UI structure ("You'll find: • A pull-quote... • Four info
   cards... • Sidebar links...").
2. Second pass added an explicit list of forbidden UI words — the model
   complied with the letter (no more "sidebar"/"card") but found workarounds
   ("This material introduces...", "You'll also see...") — still framing the
   answer as describing an artifact rather than explaining the topic.
3. Third pass forbade the *framing* itself (no stand-in noun for "the thing
   being described," no "introduces"/"covers"/"you'll see") and added a
   concrete before/after example ("start with 'A Boost Point is...', never
   'This page introduces Boost Point...'"). This is what actually fixed it —
   the negative word-list alone wasn't enough; the model needed a positive
   example of the desired opening move.

## Test transcript

Session ID: `45d1b323-c6ff-497f-8073-5c46d11527aa` (R2, `conversations/`
prefix) — created solely for this test via direct API calls (curl), not
through the browser.

**Q1 — "What's in this page?" with no `pagePath` (should decline, not guess):**
> I'm not sure which page you mean. Could you share the title or URL so I
> can explain its contents?

**Q2 — same question, `pagePath: "/solutions/personal-productivity"` (final prompt):**
> Personal productivity enhancements are lightweight AI capabilities that
> boost individual user productivity without touching your product's core
> architecture. As the first of Ragtime-Pro's five AI solution categories,
> they deliver fast, low-risk wins that prove modernization is possible,
> reduce user friction, and build trust.
>
> Value
> • Speeds up daily tasks, cuts errors, lowers support tickets
>
> Examples
> • Smart suggestions for text and actions
> • Guided data entry and semantic search
> • Instant summaries of long documents
> • Contextual assistance and inline explanations
>
> Readiness Requirements
> • Clearly defined user roles
> • Accessible screens and workflows
> • Basic workflow documentation
> • Stable integration touchpoints
>
> Roadmap Fit
> • Ideal early win to demonstrate fast, safe AI value and pave the way for
> deeper modernization.

(Value/Examples/Readiness Requirements/Roadmap Fit are real content-category
labels from `SOLUTIONS` data, not UI element names — this is content
structure, not layout description.)

**Q3 — "What's this page about?", `pagePath: "/methodology/boost-point"` (final prompt):**
> A Boost Point is the spot in a legacy product where AI can unlock the
> greatest value with the least disruption, pinpointed by our Modernization
> Agent through analysis of your code, documentation, workflows, usage
> patterns and competitive gaps. Anchoring AI Upgrade Modules on Boost
> Points means every enhancement addresses a real, high-impact
> opportunity—whether that's adding intelligence to a static module,
> automating a repetitive workflow, modernizing a dated user experience,
> operationalizing tribal knowledge or augmenting a decision process. Feel
> free to reach out via our contact form or book an introductory call.

## Outcome

Both reported issues verified fixed. `npx tsc --noEmit` and `npm run lint`
clean on the final code.

## Cleanup

Test session `45d1b323-c6ff-497f-8073-5c46d11527aa` is sitting in R2 and can
be deleted once reviewed.
