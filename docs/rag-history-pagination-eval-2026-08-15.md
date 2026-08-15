# RAG Chat History Persistence & Pagination — Eval (2026-08-15)

## Feature

Previously, `SessionData.history` was the *only* stored transcript, and
`summarizeSession()` truncates it to the last 4 messages whenever
summarization fires (`history.length > 20` or `>1500` tokens). Since the
chat pane hydrated from that same field on open, anything folded into the
summary disappeared from the UI on the next page load / reopen.

This change adds:
- `SessionData.fullHistory` — an append-only transcript, never truncated,
  kept separate from the summarization-trimmed `history` used for LLM
  context. Optional on the type for backward compat with sessions written
  before this field existed (readers fall back to `history`).
- `GET /api/rag/session/history?before=&limit=` — paginated read over
  `fullHistory`. Server still loads the whole R2 object (no partial-JSON
  reads), but only returns a page to the client, so the browser doesn't
  hold/render the entire transcript at once.
- `GET /api/rag/session` and `POST /api/rag/session/confirm` now strip
  `fullHistory` from their response bodies (`omitFullHistory` in
  `src/rag/session.ts`) so those endpoints stay lightweight regardless of
  how long the conversation has gotten.
- `ChatWidget.tsx` loads only the latest page (`HISTORY_PAGE_SIZE = 20`)
  on open/confirm, and fetches the next-older page when the user scrolls
  within 40px of the top of the message list, prepending it and
  restoring scroll position so the view doesn't jump.

## Bug found and fixed during testing

`GET /api/rag/session/history` initially returned `{ messages: [],
hasMore: false, nextBefore: 0 }` even when `fullHistory` had real content.

Root cause: `Number(searchParams.get("before"))` — when the `before`
query param is absent, `searchParams.get()` returns `null`, and
`Number(null)` is `0`, not `NaN`. That `0` passed the `Number.isFinite(...)
&& beforeParam >= 0` check, so "no `before` given" silently resolved to
"before index 0" instead of defaulting to the latest page, and the slice
came back empty.

Fix: check `searchParams.get("before") === null` explicitly before
calling `Number()` on it, rather than relying on `Number.isFinite`
alone to catch the absent case.

## Test procedure

1. Created a fresh session via `GET /api/rag/session`.
2. Sent 12 real turns through `POST /api/rag/answer` (24 messages) —
   enough to cross `MAX_HISTORY_LENGTH = 20` and trigger real
   summarization mid-conversation.
3. Confirmed via a temporary debug route (removed before commit) that
   `fullHistory` held all 24 messages in R2 while the summarization-
   trimmed `history` had been cut to 6 (4 retained + the 2 from the
   triggering turn) — i.e., the full transcript survived summarization
   in storage.
4. Confirmed `GET /api/rag/session` and `POST /api/rag/session/confirm`
   responses do not include a `fullHistory` key.
5. Walked `GET /api/rag/session/history` backward in pages of 8:
   latest page → turns 9-12 (`hasMore: true`, `nextBefore: 16`); next
   page → turns 5-8 (`hasMore: true`, `nextBefore: 8`); oldest page →
   turns 1-4 (`hasMore: false`, `nextBefore: 0`). Confirmed content and
   ordering were correct on `nextBefore` reuse.
6. In the browser, temporarily set `HISTORY_PAGE_SIZE = 2` to exercise
   the scroll-triggered loading with a small, real conversation already
   in the pane: scrolling to the top of the message list loaded and
   prepended older turns with no visible scroll jump, and repeating the
   scroll at the actual top (no more history) did nothing further
   (`hasMore: false`) — no errors, no duplicate messages, no infinite
   loop. Reverted `HISTORY_PAGE_SIZE` to `20` afterward.
7. Sent one additional message after the pagination test to confirm
   normal send/receive still works unchanged.

## Full transcript (synthetic 12-turn test session)

Session ID: `c8169ea6-96b3-4b96-9f9e-84ea2fbb5e79` (R2, `conversations/`
prefix) — created solely for this test via direct API calls (curl), not
through the browser.

<!-- markdownlint-disable -->

### 1. user

Test question number 1 about AI modernization for legacy software. Keep your answer short.

### 2. assistant

AI modernization for legacy software means using our Modernization Agent to identify high-value Boost Points, sequence them by Opportunity and Readiness, and integrate targeted AI Upgrade Modules into your existing product safely and incrementally—no full rewrite required.

### 3. user

Test question number 2 about AI modernization for legacy software. Keep your answer short.

### 4. assistant

We sequence modernization via our Product Modernization Triad—identifying high-impact Boost Points, scoring their Opportunity, checking Readiness—then roll out targeted AI Upgrade Modules incrementally, so you modernize safely without a full rewrite.

### 5. user

Test question number 3 about AI modernization for legacy software. Keep your answer short.

### 6. assistant

We leverage our Modernization Agent and the Product Modernization Triad to pinpoint high-value Boost Points, assess Opportunity and Readiness, and integrate AI Upgrade Modules safely and incrementally without a full rewrite. Please continue via our contact form or book an introductory call.

### 7. user

Test question number 4 about AI modernization for legacy software. Keep your answer short.

### 8. assistant

Our process uses the Modernization Agent plus our Product Modernization Triad to scan your legacy code, identify high-value Boost Points, score their Opportunity and Readiness, and then deploy targeted AI Upgrade Modules—like RAG assistants or reasoning agents—incrementally. This keeps your product stable, compliant, and continuously evolving without a full rewrite.

### 9. user

Test question number 5 about AI modernization for legacy software. Keep your answer short.

### 10. assistant

We use our Modernization Agent plus the Product Modernization Triad to scan your legacy code, pinpoint high-value Boost Points, score their Opportunity and Readiness, and roll out AI Upgrade Modules in small, safe increments—no full rewrite required.

### 11. user

Test question number 6 about AI modernization for legacy software. Keep your answer short.

### 12. assistant

We use our Modernization Agent to map your legacy architecture, pinpoint high-value Boost Points, score them by Opportunity and Readiness, and deploy AI Upgrade Modules—like RAG assistants or reasoning agents—safely and incrementally. Feel free to continue via our contact form or book an introductory call.

### 13. user

Test question number 7 about AI modernization for legacy software. Keep your answer short.

### 14. assistant

We run your code through our Modernization Agent, use the Boost Point-Opportunity-Readiness Triad to pick and order the highest-value upgrades, then deploy targeted AI Upgrade Modules—like RAG assistants, workflow automations, or reasoning agents—incrementally and safely, with no full rewrite.

### 15. user

Test question number 8 about AI modernization for legacy software. Keep your answer short.

### 16. assistant

We run your product through our Modernization Agent, use the Boost Point-Opportunity-Readiness Triad to pick and order high-value upgrades, and then integrate AI Upgrade Modules—like RAG assistants or workflow automations—incrementally, with no full rewrite.

### 17. user

Test question number 9 about AI modernization for legacy software. Keep your answer short.

### 18. assistant

We use our Modernization Agent and Product Modernization Triad (Boost Point, Opportunity, Readiness) to sequence targeted AI Upgrade Modules into your legacy software safely and incrementally—no rewrite required. Feel free to continue via our contact form or book an introductory call.

### 19. user

Test question number 10 about AI modernization for legacy software. Keep your answer short.

### 20. assistant

Our Modernization Agent analyzes your legacy product to find high-value Boost Points, our Triad then ranks them by Opportunity and Readiness, and we integrate AI Upgrade Modules step by step—modernizing safely without a full rewrite.

### 21. user

Test question number 11 about AI modernization for legacy software. Keep your answer short.

### 22. assistant

We apply our Modernization Agent plus the Boost Point-Opportunity-Readiness Triad to identify and sequence high-value AI Upgrade Modules—like RAG assistants, intelligent workflows, or reasoning agents—and integrate them into your legacy software incrementally, keeping it stable and compliant without a full rewrite.

### 23. user

Test question number 12 about AI modernization for legacy software. Keep your answer short.

### 24. assistant

We use our AI-driven Modernization Agent to identify and rank high-value Boost Points by Opportunity and Readiness, then integrate targeted AI Upgrade Modules—such as RAG assistants or intelligent workflows—into your legacy product incrementally, ensuring stability without a full rewrite. To explore how this applies to your software, feel free to get in touch via our contact form or book an introductory call.

<!-- markdownlint-enable -->

## Outcome

All checks passed after the `before`-param fix. `npx tsc --noEmit` and
`npm run lint` are both clean on the final code.

## Cleanup

The synthetic 12-turn test session above (`c8169ea6-...`) is sitting in
R2 and can be deleted once reviewed. Separately, the browser session used
for the scroll-UI check already had a real prior test conversation in it
before this session started, and now has one additional message ("Quick
smoke test after the history-pagination change.") appended to it —
flagged for the user rather than deleted unilaterally, since that
conversation predates this test.
