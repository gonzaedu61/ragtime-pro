# RAGnify — Website Specification Document
This document defines the narrative, deterministic, and human‑readable specification of the RAGnify website.  
Claude Code must maintain this document and ensure it always reflects the current state of the codebase, architecture, content, design system, and authoritative documents.

---

# 1. Website Purpose & Positioning

**Transitional note:** every page has now been rebranded to RAGnify's AI-driven,
legacy-software-modernization positioning. This note is kept for historical context
on the rebrand's progression rather than as an outstanding-work tracker. Our
Methodology (including its new Modernization Journey subpage) has been rebranded, as
have the Boost Point (routed at `/methodology/boost-point` — see PAGE 8), Opportunity
(see PAGE 9), and Readiness (see PAGE 10) vertex subpages — all three vertices are now
rebranded. Solutions is also fully rebranded — overview page, card teasers, and all
five detail pages (see PAGE 5 and PAGE 6). The Modernization Agent page (formerly
"Engagement Model") is fully rebranded (see PAGE 12), About (formerly "About The
BrokerAI") is fully rebranded (see PAGE 11), EU AI Act Compliance is fully rebranded
(see PAGE 15), Start Your Journey is fully rebranded (see PAGE 13), The
Modernization Dilemma (formerly "The AI Dilemma," nav label and route unchanged) is
fully rebranded (see PAGE 2), Core Barriers to Modernization (formerly "Core
Barriers") is fully rebranded (see PAGE 3), Coaching: The AI-Augmented Barrier
Breaker (formerly "The Barrier's Breaker") is fully rebranded (see PAGE 4), Contact
is fully rebranded (see PAGE 14), and Privacy Policy and Terms of Service are fully
rebranded, including the removal of the inapplicable "Vendor referrals" clause (see
PAGE 16 and PAGE 17). The actual production mail infrastructure (Vercel env vars,
Purelymail mailbox) has not been updated to match the `info@ragnify.pro` address
used across the site's copy — see §8.4/§8.5. Note the mail domain (`ragnify.pro`)
is intentionally distinct from the production website domain, which remains
`ragtime.pro` (see §8.6).

## 1.1 Primary Goal
Convert SME leaders who feel uncertain about AI adoption into qualified leads for:
- Coaching  
- Roadmap design  
- Long‑term AI transformation services  

## 1.2 Core Value Proposition
"We remove uncertainty. We turn AI from a foggy ambition into a safe, structured, and high‑impact roadmap."

## 1.3 Target Audience
- SME owners and directors  
- Operations managers  
- Compliance & governance leads  
- Non‑technical decision‑makers  
- EU‑based businesses concerned about AI Act compliance  

## 1.4 Brand Personality
- Expert  
- Neutral / vendor‑agnostic  
- Structured  
- Reassuring  
- European, regulatory‑aware  
- High‑trust, high‑clarity  

---

# 2. Information Architecture (Sitemap)

## 2.1 Top-Level Navigation
Home is reached via the navbar logo/brand mark, not a nav item. Nav labels were
shortened from their original, more descriptive phrasing to balance the navbar's
horizontal weight against the enlarged logo — the linked pages' own titles/H1s are
unchanged.
1. AI Dilemma (nav label; page is "The AI Modernization Dilemma")  
2. AI Solutions (nav label; page is "Solution Categories")  
3. Modernization Agent (nav label; page is "The Modernization Agent" — see PAGE 12)  
4. Methodology (nav label; page is "Our Methodology")  
5. About Us (nav label; page is "About RAGnify" — see PAGE 11)  
6. Compliance (nav label; page is "EU AI Act Compliance")  
7. Start The Journey (nav label; page is "Start Your Journey")  
8. Contact  

## 2.2 Footer Navigation
- Privacy Policy  
- Terms of Service  
- Contact  

**Pending:** a LinkedIn link was removed — RAGnify does not yet have a LinkedIn
page. Re-add it here (and in `Footer.tsx`) once one exists.

---

## 2.3 URL Structure
- Home — `/`
- The AI Dilemma — `/ai-dilemma`
  - Core Barriers — `/ai-dilemma/barriers` (standalone route, linked from The AI Dilemma; not in top nav)
  - Coaching — `/ai-dilemma/coaching` (standalone route, linked from Core Barriers; not in top nav)
- Solution Categories — `/solutions`
  - Personal Productivity — `/solutions/personal-productivity`
  - Intelligent Workflows — `/solutions/workflow-automation`
  - RAG Solutions — `/solutions/rag-solutions`
    - ALMENDRO Manual Assistant — `/solutions/rag-solutions/almendro-demo` (standalone route, static path nested under the dynamic `/solutions/[slug]` route with no conflict since Next.js resolves the more specific literal path first; linked from the RAG Solutions detail page's "See a RAG Assistant Demo ..." button; not in top nav — see PAGE 6A)
  - Reasoning Agents — `/solutions/reasoning-agents`
  - Custom AI Models — `/solutions/custom-models`
- Our Methodology — `/methodology`
  - The Modernization Journey — `/methodology/process` (standalone route, linked from Our Methodology's "Check the steps ..." CTA; not in top nav)
  - Boost Point — `/methodology/boost-point` (standalone route, linked from Our Methodology's pillar cards; not in top nav)
  - Opportunity — `/methodology/opportunity` (standalone route, linked from Our Methodology's pillar cards; not in top nav)
  - Readiness — `/methodology/readiness` (standalone route, linked from Our Methodology's pillar cards; not in top nav)
- About RAGnify — `/about`
- The Modernization Agent — `/modernization-agent`
- Start Your Journey — `/start`
- Contact — `/contact`
- Privacy Policy — `/privacy-policy`
- Terms of Service — `/terms-of-service`
- EU AI Act Compliance — `/eu-ai-act-compliance` *(top-level nav item only — the Home
  page no longer links here after the RAGnify rebrand dropped the "EU Compliance
  Support" value block; not linked from the footer)*

---

# 3. Page-by-Page Specifications

## PAGE 1 — HOME

### Purpose
Immediate clarity: what RAGnify does, for whom, and why it matters.

### Hero Section
- **Headline:** A `RotatingHeadline` component (`src/components/RotatingHeadline.tsx`)
  cycles through five two-line phrases every 8 seconds, cross-fading between them, and
  starts on a random phrase each time the component mounts (page load or return
  navigation to `/`) rather than always opening on the same one: "If your product seems
  to be falling behind… we bring it back to the front", "Your software doesn't need a
  rewrite… It needs a new rhythm.", "If daily operations lock your resources… we bring
  the capacity to make it happen.", "If customer satisfaction is fading… we help your
  product win their hearts again", "If AI modernization feels overwhelming…
  we make it simple and doable".
- **Subheadline:** A safe, structured, and effective approach to AI‑driven
  modernization for legacy software products. (`text-xl`, up from the sitewide
  default `text-lg` used for most intro paragraphs.)
- **CTAs** (left to right, `sm:gap-20` between the two):  
  - Start the journey … → `/start` (with the `start.svg` icon displayed beneath the
    button; replaced the former "Watch the AI-Roadmap-Guide video" `RoadmapVideoButton`)
  - Request an Intro Call → `/contact` (with the `discovery_call.svg` icon displayed
    beneath the button; renamed from "Book an Intro Call" — there's no scheduling/
    booking mechanism behind it, just the contact form, and the old wording was
    contributing to the RAG reply prompts hallucinating one — see
    `docs/rag-hallucination-fixes-2026-08-16.md`)

### Hero Visual
Removed. The Home hero no longer includes a separate large logo motif; the
logo lockup now appears only in the navbar (see §10.1).

### Hero Avatar Video
Unlike every other page (which uses the left-gutter/absolute-positioning pattern
described in §10.3), Home keeps an inline hero row, since it also needs to fit the
`RotatingHeadline` and the `ChatBubbleTrigger` alongside the avatar. The three sit in
one flex row (`justify-between`) inside a `max-w-[96rem]` container — deliberately
wider than the `max-w-7xl` used by the Key Value Blocks below, so the avatar and chat
icon can sit further out toward the edges without needing to align with the card grid.
`max-width` was used instead of negative margins specifically to avoid
horizontal-overflow risk at in-between viewport widths (a container can only shrink to
fit available space, never force overflow beyond it). Below `lg`, the row stacks
vertically: avatar, then headline, then chat trigger — note this reordered the avatar
to the top on mobile (it previously came after the headline+CTA group).
`HeroAvatarVideo` here uses its default `Liz.jpg` + `Home.mp4`.

### Chat Trigger
`ChatBubbleTrigger` (`src/components/chat/ChatBubbleTrigger.tsx`) shows the
`Bubbles_grey.svg` icon (`h-20`, fixed size — no hover zoom) with the caption "Better a
chat …?" (`text-lg text-charcoal`, stays black — no hover color change) beneath it,
right of the headline in the hero row above. On hover, the icon crossfades to
`Bubbles_blue.svg` (two absolutely-stacked `Image`s with opposing opacity
transitions — the same crossfade technique `SolutionDetail`'s sidebar uses for its
`icon`/`iconHover` pair, though that one also scales; this one deliberately doesn't),
rather than scaling or recoloring. On click, it captures its own screen position and
calls `open()` on
`ChatWidgetContext`, which the floating `ChatWidget` uses as the anchor point for its
zoom-in-from-icon opening animation and symmetric zoom-out-to-icon closing animation —
see §10.3 "Zoom-from-icon open/close animation" and §8.7. This larger
hero-row trigger is Home-only; every other page instead has the smaller
icon-only `ChatBannerTrigger` on its navy pull-quote bar (§10.1, §10.3).

### Key Value Blocks
Each block links to the page that expands on it. Grid order (2 columns: top-left,
top-right, bottom-left, bottom-right):
1. We Bring Structure → `/methodology/boost-point`
2. Our Modernization Agent → `/modernization-agent`
3. Incremental Modernization → `/methodology`
4. AI Upgrade Modules → `/solutions`

---

## PAGE 2 — THE MODERNIZATION DILEMMA

### Purpose
Explain the problem legacy software vendors face. Sourced from the PDF's "PAGE 2 —
THE MODERNIZATION DILEMMA" chapter. Metadata title renamed from "The AI Dilemma" to
"The Modernization Dilemma" to match the PDF chapter title; the H1 reads "The AI
Modernization Dilemma" (kept distinct from the metadata title by explicit request).
The nav label ("The AI Dilemma") and route (`/ai-dilemma`) are unchanged for now —
same kept-until-explicitly-renamed pattern as the Modernization Agent page before its
own route rename (see PAGE 12).

### Hero Avatar Video
`HeroAvatarVideo` (`Liz.jpg` + `The_AI_Dilema.mp4`), horizontally aligned with the H1
— see §10.3 "Hero avatar video".

### Quote
“The product still works — but the market has moved.”

### Intro Text + CTA (below quote, above cards)
A centered two-column group (stacks on mobile): on the left, intro text (the video
icon formerly here has moved to the Hero Avatar Video above the H1 — see §10.3)
explaining that thousands of European software vendors run legacy products that are stable and
trusted but risk falling behind as AI-native competitors move faster, customers
expect modern experiences, and regulatory pressure increases — and that while AI
itself (RAG, workflow automation, reasoning agents, custom models) is ready and
accessible, the modernization path forward often isn't clear. On the right, the
`barriers.svg` icon above a "Know the barriers …" link button →
`/ai-dilemma/barriers`. Same layout pattern as the intro text + icon/button groups on
the other AI Roadmap pages.

### Sections
- Legacy at a Crossroads  
- Experimentation Without Strategy  
- Mounting Pressure — body text nests an inline `<Link>` on "EU AI Act" →
  `/eu-ai-act-compliance`  
- The Paradox of Reliability  

---

## PAGE 3 — CORE BARRIERS TO MODERNIZATION

### Purpose
Show empathy and expertise by naming the four barriers to legacy software
modernization. Sourced from the PDF's "PAGE 3 — CORE BARRIERS TO MODERNIZATION"
chapter. H1 and metadata title renamed from "Core Barriers" to "Core Barriers to
Modernization"; nav breadcrumb label "Core Barriers" (linked from The AI Dilemma
page) is unchanged.

### Hero Avatar Video
`HeroAvatarVideo` (`Liz.jpg` + `Core_Barriers.mp4`), horizontally aligned with the H1
— see §10.3 "Hero avatar video".

### Quote
“The four barriers are real — but they are not unbreakable.” *(adapted from the PDF
chapter's closing section, "not permanent")*

### Intro Text + CTA (below quote, above cards)
A centered two-column group (stacks on mobile): on the left, intro text (the video
icon formerly here has moved to the Hero Avatar Video above the H1 — see §10.3)
explaining
that modernizing a legacy software product is a multidimensional transformation
touching architecture, operations, customer expectations, and organizational
psychology — vendors don't fail to modernize for lack of ambition, but because they
face four systemic barriers universal across industries, architectures, and product
types. On the right, the `broken_barrier.svg` icon above a "Break the barriers …"
link button → `/ai-dilemma/coaching`. Same layout pattern as The Modernization
Dilemma page's intro text + barriers icon/button group.

### Four Barrier Cards
1. **Cost Perception** — the real cost isn't modernizing, it's stagnation:
   declining competitiveness, rising maintenance costs, and customer churn.
2. **Skills Gap** — AI engineering, RAG architecture, and modernization sequencing
   require expertise brought alongside the vendor's team, not instead of it.
3. **Organizational Resistance** — fear of destabilizing the product or losing
   control stalls progress even with leadership support; reduced with clarity,
   evidence, and incremental wins.
4. **Compliance & Ethics** — body text nests an inline `<Link>` on "EU AI Act" →
   `/eu-ai-act-compliance`; transparency, risk classification, data governance, and
   human oversight built into the roadmap from day one.

---

## PAGE 4 — COACHING: THE AI-AUGMENTED BARRIER BREAKER

### Purpose
Explain the core service: AI-augmented coaching, powered by the Modernization Agent.
Sourced from the PDF's "PAGE 4 — COACHING: THE AI-AUGMENTED BARRIER BREAKER" chapter.
H1 and metadata title renamed from "The Barrier's Breaker" to "The AI-Augmented
Barrier Breaker" (metadata title keeps the "Coaching:" prefix, H1 does not).

### Hero Avatar Video
`HeroAvatarVideo` (`Liz.jpg` + `Barriers_Breaker.mp4`), horizontally aligned with the
H1 — see §10.3 "Hero avatar video".

### Quote
“Coaching becomes the engine breaking the barriers - amplified by AI itself.”

### Intro Text + CTA (below quote, above cards)
A centered two-column group (stacks on mobile): on the left, intro text (the video
icon formerly here has moved to the Hero Avatar Video above the H1 — see §10.3)
explaining
that modernization coaching traditionally depended entirely on human consultants, but
RAGnify's coaching is AI-augmented, powered by the Modernization Agent (first
mention is an inline `<Link>` → `/modernization-agent`), which performs the heavy
analytical work (scanning code, mapping dependencies, identifying Boost Points —
inline `<Link>` → `/methodology/boost-point` — evaluating integration paths,
assessing EU AI Act implications — inline `<Link>` → `/eu-ai-act-compliance`). The
consulting team brings modernization expertise, the vendor's team brings product
knowledge, and the Modernization Agent brings analytical acceleration. On the right,
the RAGnify logo (`RAGnify_Logo.svg`, shown smaller here than the navbar's own lockup — `h-20` vs the navbar's `h-[84px]`) above a "We can help you …" link button
→ `/about`. Same layout pattern as The Modernization Dilemma and Core Barriers to
Modernization pages' intro text + icon/button groups.

### Key Blocks
- Demystification — the Modernization Agent analyzes undocumented/fragmented legacy
  architectures automatically, highlighting risks and constraints.
- Bridging the Skills Gap — safe integration points for RAG, workflow, and reasoning
  capabilities, with explanations tailored to the team's skill level.
- Reducing Resistance — evidence-based paths, risk-controlled plans, and early wins.
- Ensuring Compliance — body text nests an inline `<Link>` on "EU AI Act" →
  `/eu-ai-act-compliance`; risk categories, transparency, data governance, and human
  oversight evaluated before any step proceeds.
- Building Confidence (second row, alongside Ensuring Compliance) — a leadership team
  that understands its modernization roadmap and trusts the decisions behind it.

---

## PAGE 5 — AI SOLUTION CATEGORIES

### Purpose
Introduce the five AI Solution Categories as a modernization roadmap, not a menu.

### Hero Avatar Video
`HeroAvatarVideo` (`Clint.jpg` + `AI_Solutions.mp4`), horizontally aligned with the H1
— see §10.3 "Hero avatar video".

### Quote
“There is no single AI solution — only the right category for the right challenge.”
*(kept on one line via `lg:whitespace-nowrap` on wide viewports)*

### Intro Text + CTA (below quote, above cards)
A centered two-column group (stacks on mobile): on the left, intro text (the video
icon formerly here has moved to the Hero Avatar Video above the H1 — see §10.3)
explaining that
different products, architectures, and customer bases require different modernization
intensities, so modernization is organized into five AI Solution Categories — each a
distinct layer of capability, complexity, and value, integrable incrementally, and
sequenced by the Modernization Agent (an inline `<Link>` → `/modernization-agent`) — not
a menu of features to pick from, but carefully crafted into a roadmap. On the right, a
roadmap icon (`roadmap.svg`)
above a "Setting the roadmap …" link button → `/methodology`. Same layout pattern as the
intro text + icon/button groups on the other AI Roadmap pages.

### Five Cards
1. Personal Productivity  
2. Intelligent Workflows  
3. RAG Solutions  
4. Reasoning Agents  
5. Custom AI Models  

**Rebrand status:** this page is fully rebranded. Its quote and intro text are drawn from
the PDF's Page 5 opening framing, plus an original quote about choosing the right category
rather than a single AI solution. Each card's `teaser` in `src/lib/solutions.ts` (the
overview grid copy) merges this chapter's own PDF tagline (what the category is — e.g.
"AI that operationalizes your product's knowledge") with the outcome phrase from the
Product Modernization Triad's Opportunity vertex (why you'd pick it — e.g. "knowledge
leverage"; see PAGE 9), so each teaser reads as definition + outcome in one line. Every
solution's deeper detail-page content (`definition`, `overview`, `quote`, `smeValue`,
`examples`, `readinessRequirements`, `roadmapFit`) is rebranded too, sourced from the
PDF's per-category chapters (see PAGE 6).

---

## PAGE 6 — SOLUTION CLASS DETAIL PAGES

Rendered by the shared `SolutionDetail` component for each `/solutions/[slug]` route.
On wide viewports (custom `min-[1440px]` breakpoint, wider than the `lg` used elsewhere)
the page below the quote is a 3-column CSS grid — sidebar | center content | roadmap
CTA — using wider `calc(50% - 30rem)` gutters (vs. the `calc(50% - 26.5rem)` pattern used
on other flanking-CTA pages) either side of a centered `max-w-5xl` column, giving the
overview paragraph and the four cards more horizontal room than the site's other
flanking-CTA layouts. Below 1440px, all three stack into a single column in the order:
intro, sidebar, cards, roadmap CTA.

### Structure
- Hero: solution title only (no subheading), plus a Hero Avatar Video —
  `HeroAvatarVideo` using the solution's own `video` field and, currently, `Clint.jpg`
  for all five solutions, gated by the `heroAvatarEnabled` field on each
  `src/lib/solutions.ts` entry (all five are now `true`) and the image overridden per
  entry via `heroAvatarImage`. This hero section was widened from `max-w-4xl` to
  `max-w-7xl` (matching every other page) so the avatar's left-gutter position lines
  up sitewide — see §10.3 "Hero avatar video".
- Quote (per-solution pull-quote, stored as `quote` on each entry in `src/lib/solutions.ts`)  
- **Center, row 1 — Intro block:** the overview paragraph (`overview` field), with an
  optional solution icon (`icon` field) to the right. The old inline `RoadmapVideoButton`
  video icon that used to sit beside this paragraph is now conditionally rendered only
  when `heroAvatarEnabled` is `false` on that solution (currently never, since all five
  are enabled) — retained in the component as a fallback rather than deleted, in case a
  future solution is added without a hero avatar. This block has a fixed height
  (`min-[1440px]:h-72`, clipped via `overflow-hidden`) on wide viewports so that switching
  between solutions never shifts the sidebar or roadmap CTA below it vertically,
  regardless of how long a given solution's overview text is — the wider `max-w-5xl`
  column (widened from `max-w-4xl` alongside the gutter change above) gives longer
  overview paragraphs enough width to fit within that fixed height without clipping.
- **Left, row 2 — Sidebar:** the other four Solution Classes, each as an icon (hover
  swaps to the `iconHover` variant) + title link to its own detail page. No heading
  label above the list. Icon size defaults to `h-16 w-10` but is tuned per solution
  where needed (currently: Personal Productivity smaller at `h-14 w-9`, Reasoning
  Agents larger at `h-[4.5rem] w-[2.75rem]`). Rows are left-aligned relative to each
  other at every viewport width (`items-start`, no responsive override), but the list
  itself is a `w-fit mx-auto` block below 1440px so the whole group sits horizontally
  centered in the viewport rather than stuck to the left edge — resets to
  `min-[1440px]:w-auto min-[1440px]:mx-0` at that breakpoint and up, where the outer
  `<nav>`'s own `justify-center` already centers it within the sidebar gutter.
- **Center, row 2 — Four cards** arranged two-by-two below the intro block: Value
  (`smeValue`), Examples (`examples`), Readiness Requirements
  (`readinessRequirements`), Roadmap Fit (`roadmapFit`).
- **Right, row 2 — Roadmap CTA:** the `roadmap.svg` icon above a "Setting the
  roadmap …" link button → `/methodology`, with an optional live-demo button (see next
  bullet) stacked directly below it, both centered on the same horizontal axis.
- **Live-demo CTA (RAG Solutions only):** a button below the roadmap CTA in the same
  column, rendered only when the solution entry sets an optional `demoHref`
  (+ `demoLabel`) field on `src/lib/solutions.ts` — currently just RAG Solutions, linking
  to "See a RAG Assistant Demo ..." → `/solutions/rag-solutions/almendro-demo` (PAGE 6A).
  Built as a generic optional field rather than a RAG-specific special case, so any
  future solution can add its own live demo the same way.

### Content Status
`quote`, `definition`, and `overview` are rebranded, sourced from the PDF's per-category
chapters (Pages 6–10: Personal Productivity Enhancements, Intelligent Workflow
Automations, RAG Solutions, Reasoning Agents, Custom AI Models). Each `quote` matches the
category's Page 5 tagline, except RAG Solutions and Reasoning Agents. RAG Solutions'
`quote` is an original line pulled from its own `overview` text instead ("Users no longer
search for answers — the product provides them."); Reasoning Agents' `quote` ("Guiding
users through complex decisions... and executing actions when asked.") reflects its
`overview` being extended to note the agent can execute, not just guide, when requested.

The four cards themselves — `smeValue` (Value), `examples`, `readinessRequirements`, and
`roadmapFit` — are instead sourced verbatim from `Cards.md` (project root), a separate
authoritative content file covering just these four fields per category. `examples` is
split from each entry's single comma-separated Examples sentence in that file into
discrete bullet items (Custom AI Models has 5 examples; the other four have 4). Unlike the
PDF-sourced `roadmapFit` used previously, `Cards.md`'s Roadmap Fit lines do not name a
Category N position at all — they describe each category's role in the roadmap directly
(e.g. "Ideal early modernization win...", "Strategic long-term investment...") without
asserting a mandatory sequence. Titles and slugs are unchanged. The
generated `<title>` now reads `{title} | RAGnify`.

### Example (RAG Solutions)
- Quote: “Users no longer search for answers — the product provides them.”
- Overview: “RAG represents a pivotal moment in any product's modernization journey — the point where it stops being a static tool and starts behaving like an intelligent assistant, capable of understanding context and retrieving relevant knowledge. Legacy products often sit on extensive documentation, domain-specific rules, and tribal knowledge held by long-time engineers — valuable, but inaccessible. Users must search manually, ask colleagues, or rely on support teams. RAG solves this by embedding that knowledge directly into the product, so users no longer search for answers — the product provides them. For many vendors, this is the single most transformative modernization step.”

---

## PAGE 6A — ALMENDRO MANUAL ASSISTANT (RAG Solutions live demo)

A standalone demo page proving out the RAG Solutions category against a real, separate
corpus rather than describing it in the abstract: 38 German-language PDF user manuals
(`docs/ALMENDRO_Manuals/`) for ALMENDRO, a legacy ERP/production-management system,
indexed and queried through a second, fully independent RAG pipeline. Deliberately
isolated from every other RAG surface on the site — different retrieval index, different
chat backend, different session store, no shared history with the main site's chat or
contact-form/email correspondence.

### Structure
- Hero: H1 "ALMENDRO Manual Assistant" (no Hero Avatar Video — this page has no avatar
  asset assigned).
- Navy pull-quote bar, reusing RAG Solutions' own quote ("Users no longer search for
  answers — the product provides them.") — no `ChatBannerTrigger` here, since the
  page's own chat trigger already serves that role.
- Intro copy explaining what ALMENDRO is and what the demo shows (kept to the manuals'
  own subject matter — an earlier aside describing the pipeline's own architecture was
  trimmed out; that detail lives in §8.8, not visitor-facing copy), followed by the
  `AlmendroChatWidget` trigger button ("Ask the ALMENDRO assistant") and a return-arrow
  icon link back to RAG Solutions (`return_icon.svg`, swapping to `return_icon_blue.svg`
  on hover via the same crossfade pattern as PAGE 6's sidebar icons) rather than a text
  link.

### Content Status
Original page copy (not sourced from the PDF/`Cards.md` — this page describes the demo
itself, not a Solution Class). ALMENDRO is a real third-party legacy product; its manuals
are used as realistic demo content, not written for this site.

### Backend
See §8.8 for the full ALMENDRO RAG pipeline and API surface.

---

## PAGE 7 — OUR METHODOLOGY (Product Modernization Triad)

### Purpose
Explain the strategic framework.

### Hero Avatar Video
`HeroAvatarVideo` (`Mary.jpg` + `Our_Methodology.mp4`), horizontally aligned with the
H1 — see §10.3 "Hero avatar video".

### Quote
“Legacy modernization is not a matter of inspiration or experimentation. It is a strategic discipline.”

### Intro Text + Diagram + Steps CTA (below quote, above cards)
A centered three-column row (stacks on mobile; vertically centered at `lg` and up).
On the left, the Steps CTA — the `steps.svg` icon above a "Check the steps ..." link
button, → `/methodology/process`, pointing readers to the eight-step Modernization
Journey (see PAGE 7A). In the middle, intro text (the video icon formerly here has
moved to the Hero Avatar Video above the H1 — see §10.3) explaining the Product
Modernization Triad —
Boost Point, Opportunity, and Readiness — and how it keeps every recommendation checked
against where AI can create the highest value, the AI Upgrade Module that fits best, and
the product's actual readiness to integrate it safely, continuously adjusted as the
product and its context evolve. The first mention of "Product Modernization
Triad", "Boost Point", "Opportunity", and "Readiness" in this text is bolded. On the
right, the triangle diagram (`product_modernization_triad.svg`) with its caption
("The roadmap adapts dynamically as these three vertices evolve.") underneath. The
Steps CTA and triad columns are `shrink-0` so only the intro paragraph reflows if the
row runs tight on width.

### Three Pillars
1. Boost Point — links to `/methodology/boost-point` (see PAGE 8)
2. Opportunity — links to `/methodology/opportunity`
3. Readiness — links to `/methodology/readiness`

Each pillar card is a `<div>` (hover lift, border, and external-link icon — same visual
pattern as the `/solutions` overview cards) with an absolutely-positioned full-card `<Link>`
underneath (`z-0`) to its own detail page, and `pointer-events-none` on the title so clicks
on it still reach that overlay link. The Opportunity card's body text contains its own
nested `<Link>` (the phrase "AI Solution" → `/solutions`), rendered above the overlay
(`z-10`) so it stays independently clickable — see §10.3 for this pattern.

---

## PAGE 7A — MODERNIZATION JOURNEY

### Purpose
Lay out the eight-step process behind every modernization engagement, sourced from
the authoritative modernization spec's "Our Methodology" chapter (Section 4, "The
Modernization Journey: A Structured Process").

### Hero Avatar Video
`HeroAvatarVideo` (`Mary.jpg` + `The_Steps.mp4`), horizontally aligned with the H1 —
see §10.3 "Hero avatar video". This page previously had no video at all; the intro
text below still has no separate inline video icon.

### Quote
“Turning AI modernization from a risky leap into a guided evolution.”

### Intro Text + CTA (below quote, above steps)
A centered two-column group (stacks on mobile, `lg:flex-row lg:justify-center`): on the
left, intro text explaining that legacy modernization is a strategic discipline, not a matter of
inspiration or experimentation, and that the methodology follows a structured,
repeatable sequence powered by the Modernization Agent (bolded and an inline `<Link>`
→ `/modernization-agent`) and executed by the consultants. On the right, the
`roadmap.svg` icon above a link button, "Check the Product Modernization Triad ..." →
`/methodology`.

### Eight Steps
1. Product Discovery & Context Mapping
2. Modernization Opportunity Analysis — body text nests an inline `<Link>` on
   "Modernization Agent" → `/modernization-agent`
3. AI Solution Category Alignment
4. Standard RAGnify Modules Mapping — matches each opportunity to RAGnify's
   library of pre-built AI Upgrade Modules, reusing one where it fits or generating a
   new module for any gap.
5. Modernization Sequencing
6. Risk & Compliance Assessment — body text nests an inline `<Link>` on "EU AI Act" →
   `/eu-ai-act-compliance`
7. Modernization Blueprint Creation
8. Guided Implementation

Same visual pattern as the Modernization Agent page's card grid (icon + title + body per
card, per-card links only on steps 2 and 6, no numeric prefix in the title since each
numbered icon, `step_1.svg`–`step_8.svg`, already carries its step number). The first
six cards sit
in a standard `<ol>` grid (`sm:grid-cols-2 lg:grid-cols-3`); cards 7 and 8
(Modernization Blueprint Creation, Guided Implementation) form a second `<ol>` below
it, sized to match the grid's column width but laid out with `flex justify-center`
so the pair centers as a group under the row above instead of sitting flush-left.

---

## PAGE 8 — BOOST POINT

### Purpose
Explain the first vertex of the Product Modernization Triad: the modernization hotspot
where AI can create the highest product value with minimal disruption.

### Hero Avatar Video
`HeroAvatarVideo` (`Mary.jpg` + `Boost_Point.mp4`), horizontally aligned with the H1 —
see §10.3 "Hero avatar video". This page previously had no video at all.

### Quote
“The point in the product where AI can create high value with minimal disruption.”

### Main Text (below quote, above cards)
A centered paragraph explaining that a Boost Point is a modernization hotspot identified
by the Modernization Agent (an inline `<Link>` → `/modernization-agent`) through
multi-dimensional analysis of source code, documentation, workflows, customer usage,
and competitive gaps — and that anchoring modernization in Boost Points ensures every
AI Upgrade Module targets a real, high-value opportunity rather than the flashiest
technology. The first mention of "Boost Point" is bolded. Fixed height (`lg:h-56
lg:overflow-hidden`) so the flanking nav/CTA beside it land at the same vertical
position regardless of paragraph length — see Flanking Nav/CTA. Trimmed to fit six
lines within the box (previously clipped its final word at wide viewports).

### Five Cards
1. Enhanceable User Experiences
2. Automatable Workflows
3. Modules Ready for Intelligence
4. Operationalizable Knowledge
5. Augmentable Decisions

Sourced from the PDF's full "Examples of Boost Points" list (Page 12). The grid is
`sm:grid-cols-2`, so cards 1–4 form two rows of two; the 5th card spans the full row
and centers itself at a single column's width (`sm:col-span-2` plus a matching
`sm:w-[calc((100%-2rem)/2)]`) rather than sitting flush-left under column 1.

### Flanking Nav/CTA (left/right of the main text, `lg` and up)
Left: `VertexTriadNav` — a small Product Modernization Triad diagram highlighting the
current vertex, with the other two vertices clickable (hover swaps to a highlighted icon)
to jump directly to their pages. Right: the `roadmap.svg` icon above an "Understand the
Modernization-Triad ..." link button → `/methodology`. Layout is a
`lg:grid lg:grid-cols-[calc(50%-26.5rem)_1fr_calc(50%-26.5rem)]` grid (same column widths
as the flanking-CTA pattern elsewhere), with `pt-8` added to the section so row 1 doesn't
sit flush against the quote banner above. The nav, Main Text, and the roadmap CTA all sit
together in row 1 (`lg:items-center`, vertically centered within the row rather than
top-aligned), coupled to the fixed-height Main Text rather than to the Four Cards below.
The cards grid is a separate
row 2 (center column only) — deliberately decoupled from the nav/CTA so its row count (one
row of 3 on Opportunity, two rows of 4 on Boost Point/Readiness) can never affect their
position. Because row 1's height is set by the taller nav diagram rather than the shorter
Main Text, the cards grid carries `lg:-mt-12` to pull it back up toward the Main Text
instead of leaving a large gap sized to the nav's height.

---

## PAGE 9 — OPPORTUNITY

### Purpose
Explain the second vertex of the Product Modernization Triad: matching the identified
Boost Point to the best-fit AI Upgrade Module.

### Hero Avatar Video
`HeroAvatarVideo` (`Mary.jpg` + `Opportunity.mp4`), horizontally aligned with the H1 —
see §10.3 "Hero avatar video". This page previously had no video at all.

### Quote
“Which AI Solution Category fits the Boost Point best.”

### Main Text (below quote, above cards)
A centered paragraph explaining that Opportunity identifies which AI Upgrade Module fits
the Boost Point best — weighing how well a candidate module fits the Boost Point, how
mature the underlying technology is, and how much integration effort it will take within
the product's existing architecture. The first mention of "Opportunity" is bolded.

### Three Cards
1. Boost Point Fit
2. Technology Maturity
3. Integration Challenge

These are evaluation criteria for choosing an AI Upgrade Module (fit, maturity,
integration effort) — distinct from the five AI Upgrade Module categories themselves
(Productivity Features, Workflow Automations, RAG Assistants, Reasoning Agents, Custom
Models), which live on the AI Solutions overview page instead (see PAGE 5) rather than
being duplicated here.

### Flanking Nav/CTA
Same pattern as the Boost Point page: `VertexTriadNav` (now displaying the Product
Modernization Triad diagram — see PAGE 8) on the left, the `roadmap.svg` icon above an
"Understand the Modernization-Triad ..." link button → `/methodology` on the right.

---

## PAGE 10 — READINESS

### Purpose
Explain the third vertex of the Product Modernization Triad: how prepared the product is
for integration.

### Hero Avatar Video
`HeroAvatarVideo` (`Mary.jpg` + `Readiness.mp4`), horizontally aligned with the H1 —
see §10.3 "Hero avatar video". This page previously had no video at all.

### Quote
“How prepared the product is to safely integrate a new AI Upgrade Module?”

### Main Text (below quote, above cards)
A centered paragraph explaining that even when a Boost Point and Opportunity are clear,
modernization must respect the product's current readiness — architecture, APIs, data
quality, documentation, team skills, governance, industry constraints, and compliance
posture — and that Readiness answers whether it's safe to modernize now. The first
mention of "Readiness" is bolded.

### Four Cards
1. Architecture & APIs
2. Data & Documentation — body text nests an inline `<Link>` on "Modernization Agent"
   → `/modernization-agent`
3. Team & Governance
4. Industry & Compliance — body text nests an inline `<Link>` on "the EU AI Act" →
   `/eu-ai-act-compliance`

Sourced from the PDF's eight Readiness factors (Page 12), paired two-per-card to fit the
existing 2×2 grid. The old "Financial Capability" card is dropped — it isn't part of the
PDF's Readiness definition.

### Flanking Nav/CTA
Same pattern as the Boost Point page: `VertexTriadNav` (now displaying the Product
Modernization Triad diagram — see PAGE 8) on the left, the `roadmap.svg` icon above an
"Understand the Modernization-Triad ..." link button → `/methodology` on the right.

---

## PAGE 11 — ABOUT RAGNIFY

### Purpose
Build trust by explaining RAGnify's modernization system as a whole — the
Modernization Agent, the Product Modernization Triad, the Consulting Layer, and AI
Upgrade Modules working together — sourced from the PDF's "PAGE 13 — ABOUT
RAGTIME-PRO" chapter.

### Hero Avatar Video
`HeroAvatarVideo` (`Liz.jpg` + `About_Us.mp4`), horizontally aligned with the H1 —
see §10.3 "Hero avatar video". `About_Us.mp4` is a dedicated video for this page,
replacing the earlier reused `We_Can_Help.mp4` asset.

### Intro Text + CTA (below quote, above cards)
A centered two-column group (stacks on mobile): on the left, intro text (the video
icon formerly here has moved to the Hero Avatar Video above the H1 — see §10.3)
introducing RAGnify
as a modernization partner for legacy software vendors, transforming mission-critical
products without rewrites or disruptive architectural change, through a combination of
AI-augmented analysis, structured methodology, expert consulting, and incremental AI
Upgrade Modules. On the right, the `mail_icon.svg` icon above a "Contact us …" link
button → `/contact`. Same layout pattern as the intro text + icon/button groups on The
AI Dilemma, Core Barriers, and Coaching pages. Intro text opens "RAGnify is a
modernization partner for European software vendors ..." — "European" added to align
with the site's EU-focused positioning.

### Sections
- Our Modernization Agent — linked card (`<Link>`, `ExternalLinkIcon`, hover-lift
  state) → `/modernization-agent`
- The Product Modernization Triad — linked card → `/methodology`
- The Consulting Layer — linked card → `/methodology/process`
- AI Upgrade Modules — linked card → `/solutions`

The four pillars of RAGnify's "precision-engineered system," per the PDF chapter's
"What Makes Us Different" section. All four cards link out, same linked-card pattern as
the Home value blocks and Solution Class cards (see §10.3 Shared Visual Patterns).

### Quote
“We are not a generic AI consultancy. We are a modernization partner.”

---

## PAGE 12 — THE MODERNIZATION AGENT

### Purpose
Explain the Modernization Agent: RAGnify's proprietary AI system and the internal
intelligence engine behind every modernization engagement — not a customer-facing tool.

### Hero Avatar Video
`HeroAvatarVideo` (`Liz.jpg` + `Modernization_Agent.mp4`), horizontally aligned with
the H1 — see §10.3 "Hero avatar video". `Modernization_Agent.mp4` is a dedicated video
for this page, replacing the earlier reused `Engagement_Model.mp4` asset.

### Quote
“The engine behind our modernization service.”

### Intro Text + CTA (below quote, above the seven cards)
A centered two-column group (stacks on mobile): on the left, intro text (the video
icon formerly here has moved to the Hero Avatar Video above the H1 — see §10.3)
explaining that
the Modernization Agent ingests the product's entire context — source code in any
language or architecture, user manuals, technical specifications, actual and intended
workflows, business processes, industry constraints, regulatory context, and the
competitive landscape — and produces actionable modernization intelligence, showing
exactly how legacy systems can be enhanced, extended, or transformed. On the right, the
`roadmap.svg` icon above a link button, "See Our Methodology …" → `/methodology`.

### Seven Cards
1. Maps the Full Picture — maps the product's architecture and understands its
   workflows and data flows, end to end.
2. Detects Boost Points — identifies the modernization hotspots where AI can create the
   highest value with minimal disruption.
3. Classifies the Right Module — matches each Boost Point (inline `<Link>` →
   `/methodology/boost-point`) to one of the 5 AI Upgrade Module categories and drafts
   its specification.
4. Adapts to Your Industry — tunes the Product Modernization Triad (inline `<Link>` →
   `/methodology`) to the product's specific industry and constraints.
5. Produces the Blueprint — generates the modernization blueprint and suggests safe
   integration patterns for the architecture.
6. Code AI Upgrade Modules — generates the required code to adapt and integrate
   existing standard RAGnify AI Modules (inline `<Link>` → `/solutions`) or develop
   ad-hoc ones if required.
7. Ensures Safe Execution — ensures compliance alignment and supports our consultants
   throughout execution.

Sourced from the PDF's opening "1. The Modernization Agent" section and the "PAGE 4 —
COACHING" chapter's "2. The Modernization Agent: Your AI Partner" section. Text-only
cards (no icons), grid `sm:grid-cols-2 lg:grid-cols-3`. The 7th card spans the full row
(`sm:col-span-2 lg:col-span-3`) and centers itself (`lg:mx-auto`) at double the width of
a standard grid column (`lg:w-[calc(((100%-3rem)/3)*2)]`), so it visually overlaps the
bottom edges of the two cards above it rather than sitting flush-left.

---

## PAGE 13 — STARTING THE JOURNEY

### Purpose
Conversion page. Sourced from the PDF's "PAGE 14 — CONTACT & ENGAGEMENT" chapter's
"Modernization Begins With a Conversation" and "How Engagement Works" sections.

### Hero Avatar Video
`HeroAvatarVideo` (`Liz.jpg` + `Start_Journey.mp4`), horizontally aligned with the H1
— see §10.3 "Hero avatar video". `Start_Journey.mp4` is a dedicated video for this
page, replacing the earlier `Starting_The_Journey.mp4` asset. The hero section's
container was also widened from `max-w-3xl` to `max-w-7xl` so the avatar's
left-gutter position lines up with every other page.

### Quote
“One conversation can change how you see your product's future.”

### Intro Text + CTA (below quote, above cards)
A centered two-column group (stacks on mobile, `lg:flex-row lg:justify-center`): on
the left, intro text (the video icon formerly here has moved to the Hero Avatar Video
above the H1 — see §10.3) explaining that legacy modernization is a partnership, not a
transaction — every product has its own history, architecture, constraints, and
ambitions, so engagement with RAGnify (inline `<Link>` → `/about`) begins not with
a proposal but with a conversation, with the goal of giving clarity, structure, and
confidence. On the right, the
`discovery_call.svg` icon below a "Request a Modernization Consultation" link button
→ `/contact`, vertically centered with the intro text. Same flanking-CTA pattern as
the Modernization Journey and Modernization Agent pages. The previous
`journey_start.svg` decorative icon (not a link) was dropped in favor of this
actionable CTA occupying the same slot.

### Three Engagement-Phase Cards (below CTAs)
1. **Our First Talk** — a conversation covering the product, goals, and constraints,
   plus an explanation of the methodology, the Modernization Agent, and the AI Upgrade
   Modules. No commitments or pressure. Body text nests three inline `<Link>`s: "our
   methodology" → `/methodology`, "Modernization Agent" → `/modernization-agent`, "AI
   Upgrade Modules" → `/solutions`.
2. **Modernization Assessment** — a structured, Modernization Agent-supported
   assessment (architecture mapping, Boost Point detection, Triad alignment,
   compliance considerations) producing a Modernization Assessment Report. Body text
   nests two inline `<Link>`s: "Boost Point" → `/methodology/boost-point` and
   "compliance considerations" → `/eu-ai-act-compliance`.
3. **Modernization Partnership** — incremental AI Upgrade Module delivery, guided
   integration, and continuous sequencing once the roadmap is validated.

Grid is `sm:grid-cols-3`. The PDF's Free/Fixed Scope/Ongoing qualifiers (from "Phase 1
— Introductory Consultation (Free)" etc.) are dropped from the site copy entirely —
titles are plain.

---

## PAGE 14 — CONTACT

### Hero Avatar Video
`HeroAvatarVideo` (`Liz.jpg` + `Contact_Us.mp4`), horizontally aligned with the H1 —
see §10.3 "Hero avatar video". This page previously had no video at all. The hero
section's container was also widened from `max-w-3xl` to `max-w-7xl` so the avatar's
left-gutter position lines up with every other page.

### Quote
“We are prepared to support you from the very first question.”

### Layout
Two-column below the quote (stacks to one column on mobile): left column holds an
enriched invitation to describe the visitor's product and where modernization fits
into its future, in their own words — sourced from the PDF's "Modernization Begins
With a Conversation" and "Your First Step" sections — plus the direct email fallback
(`text-lg`, italic, with the `mail_icon.svg` icon at `h-12` inline to its right);
right column holds the form (or the "Thank you" confirmation after submit).

### Submission Behavior
Submitting the form does a client-side `fetch` POST to `/api/contact` (see §8.4)
rather than a plain client-only state flip. While the request is in flight the
submit button is disabled and reads "Sending…"; on success the right column
swaps to the "Thank you" confirmation; on failure an inline error message
appears above the submit button asking the visitor to retry or email directly,
and the form's entered values are left intact.

The POST resolves almost immediately (after field validation only) — the
visitor is never made to wait on email generation or delivery, both of which
happen after the response is sent (see §8.4).

### Fields
- Name  
- Company  
- Email  
- Optional: “Phone”  
- Optional: “Describe your AI modernization interest”  
- Message  

### Email
info@ragnify.pro. Also updated on Privacy Policy and Terms of Service (see PAGE 16
and PAGE 17). The `/api/contact` route itself has no hardcoded address (reads
`MAIL_FROM_ADDRESS` / `MAIL_INFO_ADDRESS` from env — see §8.4); those production
values, and the underlying Purelymail mailbox, have not been updated to match.

---

## PAGE 15 — EU AI ACT COMPLIANCE

### Purpose
Explain what the EU AI Act requires of software vendors integrating AI into legacy
products, and how RAGnify builds compliance into every modernization roadmap.
Content is grounded in the PDF's Core Barriers ("Barrier 4 — Compliance & Ethics")
and Coaching ("Breaks Barrier 4") chapters, supplemented with current, externally
researched EU AI Act specifics (risk-tier definitions, obligation deadlines, and
penalty figures) since the PDF itself does not contain a dedicated compliance
chapter. Formerly expanded on a dedicated Home "EU Compliance Support" value block;
Home no longer includes one after the RAGnify rebrand, so this page is now
reached only via the top nav.

### Hero Avatar Video
`HeroAvatarVideo` (`Liz.jpg` + `EU_Compliance.mp4`), horizontally aligned with the H1
— see §10.3 "Hero avatar video". This page previously had no video at all.

### Quote
“Compliance built into the roadmap — not bolted on after launch.”

### Intro Text (below quote, above cards)
A centered two-column group (stacks on mobile): on the left, intro text explaining
that the EU AI Act does not exempt software vendors integrating AI into an existing
product, that every AI Upgrade Module is classified against the Act's four risk
tiers (unacceptable, high-risk, limited-risk, minimal-risk), and citing concrete
dates and figures — prohibited practices in force since February 2025, high-risk
obligations fully enforceable from August 2026, penalties up to €35M or 7% of
global turnover. On the right, the `EU_compliance.svg` icon above a "We can help
you …" link button → `/about` (unchanged from prior content pass).

### Six Obligation Cards
1. **Risk Classification** — the Act's four-tier system and correctly classifying
   each AI Upgrade Module before it ships.
2. **Transparency** — AI-interaction disclosure for limited-risk systems like RAG
   assistants and Reasoning Agents.
3. **Data Governance** — data quality/provenance audits before RAG or Custom Model
   integration.
4. **Human Oversight** — meaningful human-in-the-loop for high-risk automated
   decisions.
5. **Auditability & Documentation** — technical documentation, logging, and
   traceability for high-risk systems.
6. **Lifecycle Monitoring** — post-market monitoring as the product and its data
   evolve, tied to the Modernization Agent's ongoing analysis; body text nests an
   inline `<Link>` on "Modernization Agent" → `/modernization-agent`.

Grid is `sm:grid-cols-2 lg:grid-cols-3` (two rows of three). No page-ending CTA; the
obligation cards are the page's final content.

---

## PAGE 16 — PRIVACY POLICY

### Purpose
Footer/legal page explaining what personal data the site collects and how it's used.
Fully rebranded: entity name and positioning updated throughout (RAGnify is a
modernization partner combining the Modernization Agent with expert consulting,
replacing the prior "European network of AI consultants helping SMEs" framing); no
PDF chapter exists for legal boilerplate, so this was a terminology/positioning
rebrand rather than a PDF-sourced content rewrite. "Last updated" bumped to August
31, 2026 (contact address changed from `info@ragtime.pro` to `info@ragnify.pro`).

### Content
No quote band. A centered H1 + "Last updated" date, then a single-column list of
sections: Who we are; Information we collect (drawn from the actual Contact form
fields — name, company, email, message, optional phone, optional AI modernization
interest — and noting the site uses no cookies or analytics); How we use your
information (references "an introductory consultation", matching the Start Your
Journey page's phase terminology); Legal basis for processing; Sharing your
information (rewritten to drop the BrokerAI-era "specialist within our network"
brokerage language — RAGnify delivers directly, it doesn't broker third-party
vendors — replaced with generic "service providers who help us operate this website");
Data retention; Your rights (GDPR); Changes to this policy; Contact us (mailto link,
`info@ragnify.pro`).

## PAGE 17 — TERMS OF SERVICE

### Purpose
Footer/legal page governing use of the website (a separate signed agreement governs
any actual consulting engagement). Fully rebranded, same terminology/positioning
rebrand as Privacy Policy. "Last updated" bumped to August 31, 2026 (contact
address changed from `info@ragtime.pro` to `info@ragnify.pro`).

### Content
No quote band. Same layout as Privacy Policy: centered H1 + "Last updated" date, then
sections: Acceptance of these terms; About our services (RAGnify's modernization-
partner positioning, replacing "vendor-neutral network of AI consultants"; "AI Roadmap
Guide" content reference replaced with "AI Solution Categories, methodology, and
Modernization Agent descriptions"); No professional advice (the site's content is
general information, not legal/financial/regulatory advice); Intellectual property
(the "AI Roadmap Guide storyline... like the Driving-Triad" reference replaced with
"the Product Modernization Triad and AI Upgrade Module concepts"); Limitation of
liability; Changes to these terms; Contact us. No governing-law/jurisdiction clause is
included — the site owner's registered entity and jurisdiction weren't available in
the authoritative documents, so this was deliberately left for a lawyer or the site
owner to add.

**Removed section — Vendor referrals:** the original "vendor-neutral brokerage"
clause disclaiming responsibility for third-party vendors referred to via the
network no longer applies. RAGnify is not a broker; per the PDF, it directly
delivers modernization through its own Modernization Agent, consultants, and AI
Upgrade Modules, with no third-party vendor referrals in its model. The clause was
removed rather than reworded, since keeping any form of it would misrepresent how
the business actually operates. Flagged explicitly to the user as a legal-substance
change, not just a terminology swap.

---

# 4. Visual Identity Specification

## 4.1 Logo
Use the RAGnify lockup (`public/RAGnify_Logo.svg`) — three ascending equalizer
bars (the "AI" mark) paired with the "RAGNIFY" wordmark — as the brand symbol.

## 4.2 Color Palette
- Primary: Deep navy / charcoal  
- Secondary: Electric blue  
- Accent: White / light grey  

## 4.3 Typography
- Headings: Montserrat or Inter — **Selected: Inter**
- Body: Roboto or Open Sans — **Selected: Open Sans**

## 4.4 Iconography
- Line‑based  
- Minimal  
- Tech‑inspired  
- Circuit motifs  
- Triad diagram for methodology  

---

# 5. UX & Interaction Design

## 5.1 Tone
Clear, structured, reassuring.

## 5.2 Microcopy
Avoid hype. Emphasize clarity, safety, readiness.

## 5.3 Interactions
- Smooth scroll  
- Animated diagrams  
- Hover reveals on solution cards  
- Sticky top navigation  
- RAGnify Chat widget — draggable/resizable floating pane that zooms open from and closed back into its trigger icon's screen position; triggered from the Home hero (`ChatBubbleTrigger`) or, on every other page, an icon on the navy pull-quote bar (`ChatBannerTrigger`)

---

# 6. SEO Specification

## 6.1 Primary Keywords
- SME AI adoption  
- AI roadmap  
- AI coaching  
- EU AI Act compliance  
- RAG solutions  
- AI workflow automation  
- AI reasoning agents  
- Custom AI models  

## 6.2 Metadata
Each page must include:
- Title  
- Meta description  
- OG image  

**Favicon:** `src/app/icon.svg` — a copy of `public/favicon.svg` (the RAGnify logo's
icon mark only, no wordmark; replaced an earlier `icon.png`), picked up automatically
by Next.js's App Router file convention (no code in `layout.tsx` needed). Site-wide,
not per-page.

---

# 7. Conversion Strategy

## 7.1 Lead Magnets
- AI Roadmap Guide (PDF)  
- Free 30‑minute discovery call  

## 7.2 Conversion Points
- Hero CTA  
- Mid‑page CTA  
- Footer CTA  
- Contact page  

## 7.3 Trust Builders
- Quotes from authoritative documents  
- EU AI Act expertise  
- Vendor‑neutral positioning  

---

# 8. Technical Requirements

## 8.1 Stack
- Next.js  
- Tailwind CSS  
- Optional CMS: Sanity or Contentful  

## 8.2 Performance
- Lighthouse score > 90  
- Optimized SVGs  
- Lazy‑loaded animations  

## 8.3 Compliance
- GDPR  
- Cookie banner  
- EU AI Act statement page  

## 8.4 Contact Form Email Delivery
- **Transport:** `src/lib/mailer.ts` — a Nodemailer SMTP transport to Purelymail
  (`smtp.purelymail.com:587`), authenticated via the `PURELYMAIL_SMTP_USER` /
  `PURELYMAIL_SMTP_PASS` environment variables.
- **RAG-powered acknowledgement:** `src/lib/aiReply.ts` calls Azure OpenAI
  (via the `openai` package's `AzureOpenAI` client, imported from
  `openai/azure`) against the `AZURE_OPENAI_ENDPOINT` resource — deployment
  `o4-mini`, api version `2024-12-01-preview`, authenticated with
  `AZURE_AI_PROJECT_API_KEY` (a 25s timeout). Before calling the model, it
  runs the visitor's message through the same retrieval pipeline the chat
  widget uses (`hybridSearch` → `rerankCandidates`, `src/rag/retrieval/`),
  so the reply can answer their actual question with grounded content
  instead of only acknowledging it — falling back to an honest "we don't
  have enough information" rather than inventing details, pricing, or
  commitments when retrieval doesn't turn up enough. The prompt also
  receives every known page from `src/lib/pageDirectory.ts` (`getAllPages()`)
  and is told to mention a page's URL only when one is a clear, specific
  match — never to force a link. It sends a prompt built from the
  submitter's name, company (optional), email, phone, AI modernization
  interest, message, the retrieved context, and the page list, asking for a
  JSON response (`personalizedReply`, `replySubject`), auto-detecting and
  replying in the visitor's own language. The prompt describes RAGnify
  as a modernization partner combining the Modernization Agent with expert
  consulting, and signs off as "The RAGnify Team". Its closing line
  depends on a required `channel: "form" | "email"` field: `"form"` says the
  team will follow up directly using the details already provided (no
  self-service call-booking ask, since submitting the form already implies
  outreach); `"email"` invites getting in touch via the contact form at
  `/contact` to arrange an introductory call — never "book," and never
  implying the form schedules a specific time automatically, since no such
  mechanism exists (see `docs/rag-hallucination-fixes-2026-08-16.md`). If
  the call fails, times out, or the response doesn't parse into valid,
  non-empty JSON, `generateAiReply` returns `null` and the route falls back
  to a fixed acknowledgement text and subject (sender name "RAGnify",
  fallback subject "We've received your message — RAGnify", fallback
  body referencing "modernize your product") — this fallback does not vary
  by channel. See `docs/contact-rag-reply-eval-2026-08-15.md` for
  verification. Also receives a "Prior correspondence" block (summary +
  recent turns, tagged by which channel each visitor message came through)
  from `src/rag/emailHistory.ts` — see the new bullet below.
- **Correspondence history:** `src/rag/emailHistory.ts` gives replies
  memory across visits, keyed by the sender's (normalized) email address —
  the same `history`/`summary`/`fullHistory` pattern the chat widget uses
  (§8.7), stored in R2 under a separate `email-history/` prefix. Each stored
  visitor turn records which channel it came through (`"form"` or
  `"email"`), which the LLM sees when the correspondence block is included.
  `src/lib/acknowledgement.ts` loads this context before generating a reply
  and records the new turn (visitor message + reply) after sending — even
  on the fallback-text path, so the history stays accurate to what was
  actually sent. See `docs/rag-implementation-spec.md` §7.9 for the full
  design and `docs/email-history-eval-2026-08-16.md` for verification.
- **Shared send helper:** `src/lib/acknowledgement.ts` exports
  `sendAcknowledgement()`, which calls `generateAiReply` and sends the
  resulting (or fallback) text via the Nodemailer transporter, from
  `MAIL_FROM_ADDRESS`, bcc'd to `MAIL_INFO_ADDRESS` so the actual
  outgoing acknowledgement is visible internally without exposing that
  address to the visitor. Both the contact form route and the inbox-poll
  route (§8.5) call this single function, so the acknowledgement logic
  (and the bcc) is defined once. Every send includes both a `text` and an
  `html` body (Nodemailer sends these as `multipart/alternative`): a
  `linkify()` helper turns any `https?://` URL in the reply into a real
  `<a href>` in the HTML version, correctly splitting off trailing sentence
  punctuation (e.g. the period after "...rag-solutions.") so the link
  itself isn't broken. When the reply came from the model (not the static
  fallback), a short footer disclosing that is appended to both bodies —
  "This reply was generated automatically by RAGnify's AI agent." —
  muted-gray styling in the HTML version; omitted on the fallback path
  since that text isn't actually AI-generated. `acknowledgement.ts` also
  exports `sendNoreplyRedirect()` for the `noreply@` mailbox (§8.5), which
  mirrors this same structure and reuses its private HTML/linkify helpers,
  but calls `generateNoreplyRedirectReply()` instead of `generateAiReply()`
  and records the turn with `channel: "noreply"`.
- **API route:** `src/app/api/contact/route.ts` — a server-only Next.js Route
  Handler (`POST`) that validates the required fields (name, company, email,
  message) and sends two emails per submission:
  1. An acknowledgement email to the visitor's own address, via
     `sendAcknowledgement()`.
  2. A notification email to the address in `MAIL_INFO_ADDRESS` (reply-to set
     to the visitor) containing the full submission details.
- **Deferred sending:** the route responds to the client as soon as the
  required fields are validated; both emails above (including the Azure
  OpenAI call) run inside a `next/server` `after()` callback, so neither the
  AI call nor the SMTP sends block the visitor's response. Errors during this
  deferred stage are only logged server-side (`console.error`), never
  surfaced to the visitor. The route sets `export const maxDuration = 30` so
  Vercel keeps the function alive long enough to finish. Vercel enables Fluid
  Compute by default on all plans, under which the Hobby plan's duration
  limit is 300s — comfortably above the 30s set here, so no plan upgrade is
  required unless Fluid Compute has been explicitly disabled for the project.
- **Client:** the Contact page's form (`src/app/contact/page.tsx`) POSTs its
  fields as JSON to `/api/contact` and reflects sending/success/error states —
  see Page 15, "Submission Behavior".
- **Environment variables:** documented (without real values) in
  `.env.local.example`; real values live in a gitignored `.env.local` for
  local development and in the Vercel project's environment variables for
  production. Never committed. In addition to `PURELYMAIL_SMTP_USER` /
  `PURELYMAIL_SMTP_PASS` (SMTP auth), two address vars control the visible
  headers: `MAIL_FROM_ADDRESS` (the "From" on both outgoing emails, previously
  documented here as `noreply@thebrokerai.tech` in production) and
  `MAIL_INFO_ADDRESS` (the "To" on the internal notification email and the
  "Bcc" on every acknowledgement email, previously documented here as
  `info@thebrokerai.tech` in production). *(Both current-value claims are
  now flagged unverified: §8.6 found the actual production domain is
  `ragtime.pro`, not `thebrokerai.tech`, which this section's env var values
  were written against — they were never independently re-checked against
  Vercel's actual environment variables, so treat them as likely stale
  rather than confirmed.)*
  `MAIL_ACK_BLOCKLIST` (comma-separated addresses that are never
  acknowledged; see §8.5) is also part of this group. **Note:** website copy
  (Contact, Privacy Policy, Terms of Service) now displays `info@ragnify.pro`
  and `.env.local.example`'s `PURELYMAIL_SMTP_USER` placeholder has been
  updated to match, but the actual Vercel production env vars and Purelymail
  mailbox still need to be provisioned/updated separately — this repo cannot
  do that. The mail domain `ragnify.pro` is deliberately separate from the
  production website domain `ragtime.pro` (§8.6); only the email addresses
  moved.

## 8.5 Inbox Polling & Auto-Acknowledgement
- **Purpose:** automatically sends the same AI-generated acknowledgement
  (§8.4) to anyone who emails the configured info address directly, not
  just visitors who use the Contact form — plus, separately, redirects
  anyone who emails `noreply@ragnify.pro` (a send-only address that should
  never receive mail) to a real channel instead.
- **API route:** `src/app/api/inbox-poll/route.ts` — a `GET` Route Handler,
  protected by a shared secret: the request must include
  `Authorization: Bearer <INBOX_POLL_SECRET>` or it returns `401`.
  `export const maxDuration = 60`.
- **Two mailboxes, one route:** the route polls **two separate IMAP
  mailboxes** in sequence via a shared `pollMailbox()` helper — `info@` and
  `noreply@` are genuinely distinct Purelymail mailboxes (not an
  alias/forward into one inbox), so each needs its own login. Each
  mailbox's poll runs in its own try/catch, so a credentials problem or
  failure on one doesn't block the other; the response reports both
  independently.
- **IMAP polling (per mailbox):** connects via `imapflow` to
  `PURELYMAIL_IMAP_HOST:PURELYMAIL_IMAP_PORT` (Purelymail,
  `imap.purelymail.com:993`, shared by both mailboxes — only the
  user/password differ), authenticated with `PURELYMAIL_IMAP_USER` /
  `PURELYMAIL_IMAP_PASS` for `info@`, or `PURELYMAIL_IMAP_USER_NOREPLY` /
  `PURELYMAIL_IMAP_PASS_NOREPLY` for `noreply@` (distinct from the SMTP
  send credentials in §8.4). Opens `INBOX`, searches for unseen messages
  (capped at 10 per run, per mailbox), downloads and parses each with
  `mailparser`, and immediately marks it `\Seen` so a later failure doesn't
  cause it to be reprocessed forever. The parsed plain-text body is passed
  through `email-reply-parser` (`extractMessageText()`) before use — reply
  emails carry the entire quoted original thread in their body (`"On DATE,
  NAME <EMAIL> wrote: > ..."`), and without stripping that, the visitor's
  "message" would include our own prior reply as if they'd typed it,
  bloating both the LLM prompt and the stored correspondence history. See
  `docs/email-quote-stripping-eval-2026-08-16.md`.
- **Loop/spam guard** (shared by both mailboxes): a message is skipped
  (still marked `\Seen`, but no reply sent) if its sender address is in
  `MAIL_ACK_BLOCKLIST` (comma-separated env var, defaults to the site's own
  sending addresses) or if it carries an `Auto-Submitted` header other than
  `no` (autoresponders, bounces). This exists specifically to prevent a
  reply from triggering another reply in an infinite loop.
- **`info@` handling:** for each message that passes the guard, calls the
  shared `sendAcknowledgement()` (§8.4) with the sender's display name (or
  address local-part as fallback), email address, the message body as the
  "message" field, and `channel: "email"`. Company/phone/AI-interest are
  left unset.
- **`noreply@` handling:** never attempts to answer what was actually
  written there — calls `sendNoreplyRedirect()` (§8.4), which explains that
  `noreply@ragnify.pro` doesn't accept incoming mail and isn't monitored,
  points them to the site's chat widget or the contact form / `info@` for
  a real conversation, and — if there's prior correspondence on file for
  that email address from an earlier contact-form submission or `info@`
  email — briefly and warmly acknowledges it, so they feel recognized
  rather than getting a generic bounce. Recorded with `channel: "noreply"`.
  See `docs/noreply-redirect-eval-2026-08-16.md`.
- **Response:** returns `{ info: {processed, acknowledged, skipped},
  noreply: {processed, acknowledged, skipped} }` (or `{"error": "Poll
  failed"}` in place of either mailbox's stats if that mailbox's poll
  threw).
- **Trigger:** this route is not called by Vercel Cron — the Hobby plan
  limits Vercel's own Cron Jobs to once per day, too infrequent for this
  purpose. Instead it's triggered by an external free scheduler,
  **cron-job.org**, configured to `GET` this route once per minute with the
  `Authorization` header set to the `INBOX_POLL_SECRET` value. This keeps the
  polling entirely outside Vercel's native Cron product while remaining free.
- **Environment variables:** `PURELYMAIL_IMAP_HOST`, `PURELYMAIL_IMAP_PORT`,
  `PURELYMAIL_IMAP_USER`, `PURELYMAIL_IMAP_PASS`,
  `PURELYMAIL_IMAP_USER_NOREPLY`, `PURELYMAIL_IMAP_PASS_NOREPLY`,
  `INBOX_POLL_SECRET` — same storage rules as §8.4 (documented blank in
  `.env.local.example`, real values in gitignored `.env.local` / Vercel
  project settings). **The two `_NOREPLY` vars are not yet set in Vercel**
  as of this writing — until they are, the `noreply` mailbox's poll fails
  gracefully without affecting `info@`'s polling; see
  `docs/noreply-redirect-eval-2026-08-16.md`'s "Outstanding" section.

## 8.6 Deployment & Production Promotion
- **Hosting:** Vercel project `ragtime-pro` (team `the-broker-ai`), linked to
  the `gonzaedu61/ragtime-pro` GitHub repository. *(Project and team confirmed
  directly from a `vercel --prod` deploy's own output — "Deploying
  the-broker-ai/ragtime-pro" — on 2026-08-28, superseding this section's
  earlier "`thebrokerai`" project name, which appears to have been either
  stale or a planned rename that never happened.)*
- **No auto-deploy on `main`:** `vercel.json` sets
  `git.deploymentEnabled.main` to `false`, so pushes to `main` no longer
  trigger an automatic Vercel build or deployment (production or preview).
  This aligns with CLAUDE.md §10.2 ("deploy only when explicitly
  instructed"). Other branches are unaffected and still get preview
  deployments on push.
- **Manual production deploys:** shipping a change now requires an explicit
  `vercel --prod` (or a manual "Redeploy" from the Vercel dashboard) run
  against the current `main`.
- **Production domain:** `ragtime.pro` — confirmed from the same deploy
  output ("▲ Aliased https://ragtime.pro") on 2026-08-28, superseding this
  section's earlier "`thebrokerai.tech`" domain claim. *(Only the aliased
  domain itself is confirmed; the DNS/registrar details immediately below
  were written for the old `thebrokerai.tech` claim and are unverified for
  `ragtime.pro` — likely stale, not re-derived from any direct check.)*
- **DNS:** *(unverified for the current `ragtime.pro` domain — the following
  was written for the earlier, likely-incorrect `thebrokerai.tech` domain
  claim above and has not been re-checked against Vercel's actual DNS
  requirements for `ragtime.pro`.)* Domain is registered with a third-party
  registrar and DNS is managed via HostGator (not Vercel-managed
  nameservers). Required records: apex `A @ 76.76.21.21`, `www` `CNAME` to
  Vercel's assigned `vercel-dns` target. Vercel auto-issues and renews the
  TLS certificate for both hostnames once DNS verification succeeds — no
  manual certificate steps.
- **Git commit author identity (Hobby team constraint):** Vercel only
  accepts/deploys commits whose git author email is a verified email
  on GitHub *and* recognized as belonging to the Vercel account owner
  (via matching Vercel account email or a linked GitHub Login
  Connection). A mismatched commit author email blocks the
  deployment with "GitHub could not associate the committer with a
  GitHub user." Local git identity for this repo should stay set to
  the email matching the Vercel account.

## 8.7 RAG Chat Backend
The RAGnify Chat widget (§10.1, §10.3, all pages) is backed by a fully
serverless Retrieval-Augmented Generation pipeline — static local corpus
(chunking, embeddings, BM25 index, cross-encoder re-ranking), Cloudflare R2
conversation memory, and Azure OpenAI for answer generation and
summarization. Full design record, implementation notes, and QA evals live
in `docs/rag-implementation-spec.md` (not duplicated here). API surface:
- `POST /api/rag/answer` — the main chat endpoint: retrieves + reranks
  context, calls Azure OpenAI, appends the turn to R2, returns the answer.
  Accepts an optional `pagePath` (the widget sends the current route via
  `usePathname()`) so the model knows what page the visitor is on, grounded
  via `src/lib/pageDirectory.ts` rather than inferred — see
  `docs/rag-implementation-spec.md` §7.6.
- `GET /api/rag/session` / `POST /api/rag/session/confirm` — session
  resolution and the returning-visitor confirmation flow the widget uses on
  first open.
- `GET /api/rag/session/history` — paginated read over the full,
  never-truncated conversation transcript (separate from the
  summarization-trimmed history used for LLM context); the widget uses
  this to hydrate the pane and to load older messages as the user scrolls
  up. See `docs/rag-implementation-spec.md` §5.10.
- `POST /api/rag/retrieve` — retrieval-only endpoint (no answer generation),
  used for testing the retrieval pipeline in isolation.

Reuses the same Azure OpenAI credentials/deployment as the contact-form
auto-reply (§8.4) via its own client instance (`src/rag/azureClient.ts`),
not a shared module — see `docs/rag-implementation-spec.md` §11 for why.
The retrieval pipeline itself (`hybridSearch`/`rerankCandidates`,
`src/rag/retrieval/`) *is* shared with `src/lib/aiReply.ts` — the contact-
form/inbox-poll acknowledgement (§8.4) uses it to ground its replies too.

- **Chat ↔ email/form history linking:** if a visitor implies prior email or
  contact-form contact, the chat asks for the email used (or a name/company
  fallback), looks it up in the same `email-history/` R2 store the contact
  form and inbox-poll acknowledgements use (§8.4), and — once the visitor
  confirms a found match is theirs — folds that correspondence into the chat
  from then on. Separately, a visitor who chats and then submits the contact
  form in the same browser session has that chat automatically linked, and
  the resulting acknowledgement email is grounded in the chat's specifics.
  Both directions are recorded so either record can find the other. Once
  linked correspondence shows a past contact-form submission, replies (chat
  or email) stop inviting the visitor to submit the form again — it already
  reads as a duplicate ask otherwise. Full
  design, prompt-reliability notes, and verification in
  `docs/rag-implementation-spec.md` §7.12 and
  `docs/chat-email-linking-eval-2026-08-16.md`.

## 8.8 ALMENDRO RAG Demo Backend
A second, fully independent RAG pipeline backing the ALMENDRO Manual Assistant demo
(PAGE 6A) — same architectural pattern as §8.7 (flat-JSON local corpus, hybrid
dense+BM25 retrieval, Azure OpenAI for answer generation), but a completely separate
codebase tree, index, and session store, with none of §8.7's cross-session/cross-channel
matching. Deliberately simpler by design, not by omission: this demo doesn't need
visitor identity, fingerprint-based device recovery, or linking to email/contact-form
history.

**Corpus & indexing pipeline** (`build/almendro/`, manual scripts, not part of the
default `npm run build` — this corpus only changes when the source manuals do):
- `extractSpans.ts` — Node port of the site owner's existing Python PDF chunker
  (`python/Chunker.py`), using `pdfjs-dist` (legacy Node build, no worker) instead of
  PyMuPDF. Since `pdfjs-dist`'s `getTextContent()` exposes neither block/line grouping
  nor a real bold flag (unlike PyMuPDF), both are reconstructed: lines are rebuilt by
  clustering text items with near-identical baselines, and "bold" is approximated by
  which font-name IDs co-occur with above-body-size text in a given document (pdfjs
  only exposes an opaque per-document font alias, e.g. `g_d0_f2`, not the font's real
  name or weight). Word-space reconstruction is gap-based (real inter-word gaps run
  ~2.5pt+; pdfjs occasionally splits one word across adjacent items with a ~0.3pt gap) —
  naively joining every item with a space breaks words apart; naively joining with none
  merges real word boundaries together.
- `blockGrouper.ts` — header/footer stripping (repeated-signature detection in the
  top/bottom 8% of the page, appearing on ≥3 pages), table-of-contents page detection
  (leader/right-aligned-page-number heuristics), and heading/paragraph/list_item
  classification (numeric-prefix patterns like "3.4.1", a >15%-larger-than-body-text
  threshold, and the reconstructed font-name "bold" signal). Table/caption/sidebar/image
  detection from the Python original is intentionally not ported — this is a text-only
  chat demo with no image rendering.
- `assembleChunks.ts` — heading-aware chunk assembly (breaks on heading level, page
  boundary, block-kind change, or an 1500-token cap via `gpt-tokenizer`), carrying
  `doc_id`, `doc_title`, `pages`, and `heading_path` through to each chunk for citations.
- `chunkAlmendro.ts` / `embedAlmendro.ts` / `bm25Almendro.ts` (`npm run
  rag:almendro:chunk` / `:embed` / `:bm25`) — write `rag_data_almendro/{chunks,
  embeddings,bm25}.json` (3406 chunks across the 38 manuals). Embeddings use a
  **dedicated multilingual model** (`src/almendro/loaders/loadEmbeddingModel.ts`,
  `Xenova/paraphrase-multilingual-MiniLM-L12-v2`) — deliberately separate from the main
  site's English-only `Xenova/all-MiniLM-L6-v2` (`src/rag/loaders/loadEmbeddingModel.ts`),
  since this corpus is entirely German and needs real cross-lingual embedding quality
  for non-German visitor queries. BM25 tokenization uses a separate
  `src/almendro/utils/tokenize.ts`, not the site's `src/rag/utils/tokenize.ts`, since the
  latter strips non-ASCII characters and would corrupt German umlauts (ä/ö/ü/ß). Both the
  embedding input and the BM25 tokenizer input are each chunk's heading path prepended to
  its text, not the text alone — measured directly, many chunks' body text never
  restates the concept their own heading names (e.g. a paragraph about entering an
  article number whose heading is "Auftragspositionen" never says "Auftrag"), which
  otherwise left them invisible to both retrieval methods for exactly the terms that
  should find them.
- `buildManualDirectory.ts` (`npm run rag:almendro:directory`) — writes
  `rag_data_almendro/manualDirectory.json`, one entry per manual (`{ doc_id,
  description }`), read only by query expansion below, never by retrieval itself. Each
  description combines that manual's one-line topic summary — extracted from
  `ws_info.pdf`'s own "Dateiname X.pdf Beschreibung Y" directory table, itself just
  another chunked manual — with a list of that manual's own top-level chapter titles, so
  expansion can see both *what* a manual covers and the *structural* vocabulary
  (Kopfdaten, Stamm, Spezifikation, Positionen...) it's organized by; these manuals
  document "how to create a new X" under a UI-panel chapter name rather than one that
  literally reads "anlegen"/"erstellen". Scoped to only the manuals actually present in
  this build — `ws_info.pdf`'s own table lists some manuals this corpus doesn't include.
  One hand-curated addition on top of the automatic top-level capture: `basis.pdf`'s
  "Suchfunktionen" sub-chapter (the search/select convention used to find and edit an
  existing record, documented once for every screen rather than repeated per manual) is
  promoted into its entry despite being nested two levels deep — measured directly, a
  visitor asking how to edit an existing address needed this chapter and nothing
  surfaced it, since only level-1 headings are captured automatically (a broader fix
  capturing every manual's level-2 headings was measured to roughly triple the
  directory's prompt footprint for benefit confirmed only in this one case, so a
  narrow, hand-picked addition was used instead).
- The 38 source PDFs are also copied into `public/almendro-manuals/` (static assets, no
  serverless function involved) so citations can deep-link straight to the source file
  and page (`/almendro-manuals/{doc_id}.pdf#page=N`).

**Retrieval + answer generation** (`src/almendro/`, mirrors `src/rag/`'s structure but
reads from `@rag_data_almendro/*` via its own path alias, never `@rag_data/*`):
- `retrieval/dense.ts` / `sparse.ts` — dense-cosine + BM25 lookup against the ALMENDRO
  index, using the dedicated multilingual embedding model and tokenizer above.
- `retrieval/hybrid.ts` — combines and min-max-normalizes both scores (`ALPHA = 0.5`),
  returning the top 40 (`TOP_N`, wider than §8.7's 20 — this corpus is far larger, ~3406
  vs. ~200 chunks). Filters out `ws_info.pdf`'s own directory-listing chunks before
  scoring — each is a ~9-token line that triple-repeats a manual's short description (in
  its own heading and body text) and was measured to consistently outrank genuine,
  longer procedural content for any query matching that description, despite carrying no
  procedural information itself.
- `retrieval/rewriteQuery.ts` (`expandQueryForRetrieval`) — since this is a 100%-German,
  narrow-terminology corpus, a single query rewrite isn't reliable enough (measured
  directly: one attempt confidently produced a term appearing exactly once in the entire
  corpus). An LLM call generates 4 diverse German search-phrase variants using the
  manual directory as grounding context, instructed to reuse a matching directory
  entry's own wording verbatim rather than paraphrase away from it, and to combine a
  manual's subject noun with its own chapter vocabulary when the visitor is asking how
  to create or start something, and to include "Suchfunktionen" as one variant when the
  visitor is instead asking how to find, select, or edit an EXISTING record — see the
  hand-curated directory addition above. All variants (plus the original query) are
  searched via `hybridSearch` and merged, keeping each chunk's best score across
  searches.
- `retrieval/rerank.ts` — the English-trained cross-encoder used by §8.7
  (`Xenova/ms-marco-MiniLM-L-6-v2`) was measured to have no useful signal on this
  German-only corpus (uniformly near-random, deeply negative scores that discarded
  genuinely relevant candidates in favor of unrelated noise) — reranking is bypassed in
  favor of the merged hybrid score directly, widened to a top-20 pass-through window to
  compensate.
- `prompts/answerPrompt.ts` — system prompt scoped strictly to the ALMENDRO manuals (no
  RAGnify/consulting content, no forced CTA); requires the entire reply to match the
  visitor's language (reinforced a second time immediately before the query, since a
  single instruction earlier in a longer conversation was observed fading); forbids
  inventing specific steps from a mere in-passing mention of another manual's name;
  permits the model to ask the visitor a clarifying question directly in its answer when
  genuinely needed; requires literal newlines between list items rather than inline
  enumeration; recognizes conversational meta-requests (asking to repeat, translate,
  shorten, or rephrase the last answer) and answers those directly from the conversation
  history above rather than the excerpts retrieved for the meta-request's own literal
  text, which are almost always irrelevant to it; and returns structured JSON:
  `{ answer, usesManualContent, followUpTopics }`. `usesManualContent` is `false` only
  for a purely conversational turn (thanks, ok, a greeting) not asking about ALMENDRO at
  all — `answer.ts` uses it to suppress both source citations and follow-up topics for
  that turn, since retrieval still runs on the visitor's literal message regardless of
  what it is and would otherwise attach leftover, irrelevant chunks to a "you're welcome"
  reply. `followUpTopics` are up to 3 short topic hints (noun phrases, not first-person
  questions) that must be built from an excerpt's own heading rather than paraphrased or
  synthesized — reusing the manual's own section wording is what makes clicking one
  likely to retrieve that same content again — AND fully translated into the visitor's
  language exactly as the answer text is (a German heading like "Kopfdaten" becomes
  "Header data", never left untranslated): since a clicked topic becomes the visitor's
  literal next message, an untranslated topic was measured to silently flip the next
  turn's language. Topics must never reference finding or locating documentation itself.
- `answer.ts` (`generateAlmendroAnswer`) — hybrid search + query expansion → merge →
  rerank (pass-through) → build messages → call `src/almendro/azureClient.ts` (a
  dedicated client on the same Azure OpenAI resource/credentials as §8.4/§8.7, no new
  secrets, but its own deployment and a 45s request timeout — the Azure SDK locks the
  deployment in at client construction and ignores any per-call `model:` string once one
  is set, so reusing the shared client would have no effect), with
  `response_format: { type: "json_object" }` and one retry for occasional
  malformed-JSON envelopes.
  **Model history for this call site** (also used by `rewriteQuery.ts` above): started
  on `o4-mini` (shared with §8.4/§8.7), but its reasoning-token count varies enormously
  per call on identical prompts (measured 704–2240 tokens), driving 10–78s+ latency and
  an intermittent production timeout (`Vercel Runtime Timeout Error` on this route — see
  the API surface note below). `reasoning_effort: "low"` cut the reasoning-token count
  substantially but didn't eliminate the worst-case variance. Tried `gpt-4o-mini` next
  (non-reasoning, consistently fast), but a repro test found it followed this prompt's
  many rules — language-matching, `usesManualContent` classification, follow-up-topic
  grounding — unreliably: roughly a coin flip on language-matching for one query that
  `o4-mini` had answered correctly all session. Settled on **`gpt-4.1-mini`**, which
  tested as both fast and reliable (5/5 correct language-matching across
  English/German/social-turn cases in the same repro suite, consistent 6–8s latency) and
  is what's deployed now.
  Source citations are built **deterministically from the reranked chunks themselves**
  (top 3 distinct documents, in rank order), not asked of the model — the model can't
  reliably self-report which excerpts it actually used, but the reranked list already is
  that answer. Both citations and `followUpTopics` are returned empty whenever the
  model's own `usesManualContent` flag is `false` (see `answerPrompt.ts` above).

**Session persistence** (`src/almendro/session/`, its own R2 object prefix
`almendro-sessions/` on the same bucket as §8.4/§8.7's — never collides with their
`conversations/`/`email-history/` objects):
- A dedicated `almendro_session` cookie (path `/api/almendro`, 1-day max age),
  independent of the main site's `rag_session` cookie.
- No fingerprint, no `linkedEmail`, no returning-visitor confirm flow — a missing or
  unknown session id just starts a new one. The full turn history (including each
  turn's sources/follow-up topics) is stored and returned as-is; the API layer caps how
  much of it feeds back into the model's prompt (last 12 messages) without truncating
  what's stored or displayed.

**API surface:**
- `GET /api/almendro/answer` — returns the current session's stored history (empty
  array if none), used by `AlmendroChatWidget` to restore the conversation on page
  reload.
- `POST /api/almendro/answer` — the chat endpoint: retrieves + reranks, calls Azure
  OpenAI, appends the turn to R2, returns `{ answer, sources, followUpTopics }`.
  `export const maxDuration = 60` (raised from 30 after production hit a
  `Vercel Runtime Timeout Error` on this route — the main site's 30s default was too
  tight for this pipeline's two sequential LLM calls; see the model-history note in
  `answer.ts` above).
- `POST /api/almendro/session/reset` — deletes the R2 session object and clears the
  cookie, so the next message starts a genuinely fresh conversation. Backs the chat
  pane's reset icon (§10.1).

`next.config.js`'s `outputFileTracingIncludes` lists `/api/almendro/answer` alongside
the two `/api/rag/*` entries so the local embedding/cross-encoder model files are
bundled into that serverless function too; `rag_data_almendro/*.json` needs no such
entry since it's statically imported (bundled into the JS module graph automatically),
the same way `rag_data/*.json` already is.

---

# 9. Document Governance

Claude must:
- Keep this document synchronized with the codebase  
- Update sections when pages, components, or design rules change  
- Use deterministic diffs  
- Never invent features  
- Never remove sections without explicit instruction  

---

# 10. Component Library

## 10.1 Current Components
- **Navbar** (`src/components/Navbar.tsx`) — sticky top navigation (header height ~117px); renders the 8 top-level nav items (Home is reached via the logo/brand mark, not a nav item; labels shortened per §2.1), logo, and mobile menu toggle. Desktop nav shows at the `xl` breakpoint and above; below that it falls back to the hamburger menu. The logo is the `RAGnify_Logo.svg` lockup (icon + wordmark, no separate text label) in an `h-[84px] w-[260px]` box — sized to match the SVG's actual rendered height exactly, rather than a larger box with dead space below it (an earlier, taller box left ~44px of empty space under the logo, inflating the header for no visual benefit). **Static, not animated** — the box still carries a leftover 3D flip structure (`[perspective:1000px]`, a duplicate back-face `<Image>` rotated 180°) from an earlier animated version, but the rotation itself was removed at the user's request; the back-face image never becomes visible (`backface-visibility:hidden` with no rotation applied), so only the front face ever renders. Both the logo (`self-start` on its wrapping `<Link>`) and the nav items (`self-start` + `mt-[30px]` on the `<nav>`) are top-anchored to the header row and independently nudged to align with the wordmark's visual center — needed because the SVG doesn't fill its own box (it renders top-aligned at its natural aspect ratio), so centering by box bounds alone would visually misalign it against the nav text. Nav item font size is `text-lg` (bumped up from `text-base`).
- **Footer** (`src/components/Footer.tsx`) — footer navigation (Privacy Policy, Terms of Service, Contact) and copyright line. No LinkedIn link yet — see §2.2.
- **RotatingHeadline** (`src/components/RotatingHeadline.tsx`) — client component cycling through 5 two-line phrases on the Home hero, one every 8 seconds with a cross-fade transition. Starts on a random phrase on each mount (not always the first) so repeat visits and refreshes don't always open on the same line.
- **HeroAvatarVideo** (`src/components/HeroAvatarVideo.tsx`) — clickable circular avatar photo that plays an in-place explainer video with custom minimal controls; positioned in the left gutter beside each page's H1. See §10.3 "Hero avatar video" for full behavior, positioning, and the per-page image/video assignments.
- **RoadmapVideoButton** (`src/components/RoadmapVideoButton.tsx`) — reusable video-icon trigger; renders a small icon (optionally with a text label) that opens a centered modal video player animating in/out from the icon's screen position. Takes a `src` (defaults to the AI Roadmap Guide video), an optional `lowBandwidthSrc` for connection-aware source switching, and a `blueHoverIcon` toggle (icon swaps to an electric-blue variant on hover; disabled on Home and Start Your Journey, where a size-only hover effect is used instead). **No longer used anywhere** — every page that rendered it now uses `HeroAvatarVideo` instead (see §10.3); the component file remains in the repo but has zero call sites.
- **VertexTriadNav** (`src/components/VertexTriadNav.tsx`) — small Driving-Triad diagram used in the left-side nav slot on the Need/Opportunity/Readiness pages; highlights the current vertex and links to the other two.
- **SolutionDetail** (`src/components/SolutionDetail.tsx`) — shared template rendering a single Solution Class's Quote, Overview, sidebar of the other four categories, Value/Examples/Readiness Requirements/Roadmap Fit cards, and a roadmap CTA; used by the dynamic `/solutions/[slug]` route. See Page 6 for its 3-column grid layout.
- **ExternalLinkIcon** (`src/components/ExternalLinkIcon.tsx`) — small inline SVG "leads elsewhere" arrow icon (hand-drawn, no external asset). Used on every card that is itself a link, positioned bottom-right; see Section 10.3.
- **ChatWidgetContext** (`src/components/chat/ChatWidgetContext.tsx`) — React context holding the chat widget's open/closed state and the screen-position "origin" of whichever trigger opened it (used for the zoom animation). Provider is mounted once at the root layout (`src/app/layout.tsx`), wrapping the whole site, so widget state survives page navigation.
- **ChatWidget** (`src/components/chat/ChatWidget.tsx`) — the floating chat pane: draggable/resizable (`react-rnd`; min 320×380px, max 50% of viewport width and 85% of viewport height, recomputed on window resize), a black border (`border-2 border-black`) setting the pane apart from page content, a thin custom-scrollbar message list, and an input box wired to `POST /api/rag/answer`. The navy header doubles as the drag handle and uses a 3-column grid (`grid-cols-[auto_1fr_auto]`) so its contents stay clear of each other at any pane width: the left column holds a small white `Bubbles_white.svg` icon (`h-6`, via `brightness-0 invert` — the source artwork has a border ring, forced pure white by the filter) sized to fit the header's height, followed by the left-aligned title "RAGnify Chat" (`gap-3` between icon and text); the middle (flexible) column centers a 6-dot "draggable" hint (`text-white/80`, tuned for visibility against the navy header) within whatever space is left; the right column holds the close button. The pane renders at `zIndex: 100` (fixed positioning), deliberately above the hero avatar's `lg:z-[60]` (present on every non-Home page, §10.3 "Hero avatar video") and the sticky navbar's `z-50`, so it's never hidden behind other page chrome. A small diagonal-lines resize hint sits in the pane's bottom-right corner (decorative only — the whole pane is already resizable via `react-rnd`); the input row's bottom padding (`pb-6`) keeps the Send button clear of it. The message list has asymmetric horizontal padding (`pl-4 pr-2`, tight to the right border); user bubbles are right-aligned flush against it, while assistant bubbles (and the "Thinking…" placeholder) are centered with a compensating `pr-2` so they sit equidistant from both pane borders rather than inheriting the list's right-side bias. Renders nothing when closed; open/close plays a 550ms zoom animation anchored to the trigger's captured screen position via a `hidden → entering → shown → exiting → hidden` phase state machine, so the closing transition finishes before unmounting. Position and size are local component state — since the component is mounted once at the root layout and never unmounts (only its rendered output toggles), they survive both page navigation and close/reopen. On first open, checks `GET /api/rag/session` for a returning-visitor match and shows a "continue where you left off?" prompt when found, then loads the most recent page of the full transcript from `GET /api/rag/session/history` (not the summarization-trimmed `history` embedded in the session status responses, which stays intentionally short). Scrolling to the top of the message list fetches and prepends the next-older page, preserving scroll position so the view doesn't jump; reaching the actual start of the conversation just stops (no further fetches). See §8.7 for the backend it talks to.
- **ChatBubbleTrigger** (`src/components/chat/ChatBubbleTrigger.tsx`) — the `Bubbles_grey.svg` + "Better a chat …?" button that opens the widget; see Page 1 "Chat Trigger". Currently Home-only.
- **ChatBannerTrigger** (`src/components/chat/ChatBannerTrigger.tsx`) — icon-only chat trigger (`h-12`, no caption) placed on the navy pull-quote bar (§10.3) of every page except Home, absolutely positioned at the bar's far right edge (`right-6`, vertically centered). Base icon is `Bubbles_white.svg` via `brightness-0 invert` (white-on-navy, matching the pane header's own icon treatment); hovering crossfades to `Bubbles_blue_white_border.svg` using the same two-stacked-`Image`/opposing-opacity technique as `ChatBubbleTrigger`. Opens the same `ChatWidget` via the shared `ChatWidgetContext`, anchoring its zoom-open animation to this icon's screen position exactly like the Home trigger does.
- **AlmendroChatWidget** (`src/components/almendro/AlmendroChatWidget.tsx`) — self-contained trigger + floating pane for the ALMENDRO Manual Assistant demo (PAGE 6A) only; reuses `ChatWidget`'s visual design and `react-rnd` floating/draggable mechanic, but owns its open/closed state locally (no `ChatWidgetContext` — this pane never appears on any other page) and talks to `/api/almendro/*` instead of `/api/rag/*` (§8.8). Differs from `ChatWidget` in four ways: a reset icon in the header bar (next to close) that calls `POST /api/almendro/session/reset` and clears local state immediately; each assistant bubble renders a "Source References" list underneath it — document name plus leaf section number only (e.g. "mawi_best.pdf · 2.1.1"), laid out horizontally rather than stacked, each link opening the source PDF in a fixed-position, fixed-size popup window (reused across clicks via a shared window name, `window.open` with explicit `left`/`top`/`width`/`height`) rather than a new tab; each assistant bubble also renders a "Related Topics" list of up to 3 clickable follow-up-topic chips that resend the topic phrase as the next user turn on click; and both labels render bold, dark (`text-charcoal/90`), and with extra top spacing to separate them visually from the message body. No returning-visitor confirmation flow or history pagination (§10.1's `ChatWidget` has both) — history loads in full, once, on first open. **Rendered via `createPortal` straight to `document.body`** (gated on a `mounted` flag for SSR safety), unlike `ChatWidget` which renders inline in the root layout — this pane is nested inside this specific page's centered content column, and react-draggable was found to bake the node's in-flow position (from that nesting) into its `position:fixed` transform math, applying a large constant offset that pushed the pane off-screen regardless of the coordinates it was given. `ChatWidget` never hits this because it's declared at the root layout level, with no such ancestor. The displayed position is also clamped against the current window size on every render (not just captured once) as a second safety net.

## 10.2 Content Data Sources
- `src/lib/solutions.ts` — single source of truth for the 5 Solution Class entries (including each solution's `quote`), consumed by both the `/solutions` overview cards and the `/solutions/[slug]` detail pages. Also carries the optional `heroAvatarEnabled` (boolean gate) and `heroAvatarImage` (image override) fields that control the Hero Avatar Video on each detail page — see §10.3 "Hero avatar video" and Page 6 — and the optional `demoHref`/`demoLabel` fields (currently set only on RAG Solutions) that render the live-demo CTA described in Page 6.
- `docs/ALMENDRO_Manuals/` — the 38 source PDFs for the ALMENDRO Manual Assistant demo (PAGE 6A, §8.8); not website copy, a separate demo corpus.

## 10.3 Shared Visual Patterns
- **Navy pull-quote bar** — a slim `bg-navy py-8` band (`relative`, to host the trigger below) holding one italic, centered quote (`text-2xl font-medium italic text-white`), placed directly beneath each page's H1 hero. Used on every page except Home. Quotes are sourced verbatim from the AI Roadmap Guide PDF (Section 12 authoritative source), one per page — see each page's "Quote" entry in Section 3. Also hosts `ChatBannerTrigger` (§10.1) at its far right edge on every page it appears on.
- **Card color scheme** — two deliberately inverted schemes depending on page:
  - *Home*: white cards (`bg-white`) sit on a gray section (`bg-light-grey`).
  - *Every other page*: gray cards (`bg-light-grey`) sit directly on the white page background — no wrapping gray section. This applies to all content card grids (About, AI Dilemma, Core Barriers, Coaching, Methodology, Solution Class cards and detail-page cards, the Modernization Agent's cards, EU AI Act Compliance).
- **Linked-card indicator** — every card that is itself a `<Link>` (Home value blocks, Solution Class cards) shows the `ExternalLinkIcon` component pinned `absolute bottom-4 right-4` (card given `relative` + extra `pb-10`), at `text-charcoal/40` resting and `text-electric-blue` on hover, in place of any "Learn more →" text. Purely informational cards never show this icon.
- **Card hover state (linked cards only)** — `border border-transparent` at rest, transitioning to `hover:-translate-y-1 hover:border-electric-blue hover:shadow-md`. Applied only to cards that are actual links (Home value blocks, Solution Class cards); purely informational card grids do not use this pattern.
- **Hero avatar video** — `HeroAvatarVideo` (`src/components/HeroAvatarVideo.tsx`), a
  small circular (`h-36 w-36`) clickable avatar photo that, on click, plays a short
  in-place explainer video with fully custom minimal controls (a play triangle before
  playback; pause/stop icons plus a scrubber, shown only on hover during playback —
  native browser controls are not used since they get clipped by the circular mask).
  `disablePictureInPicture`/`disableRemotePlayback` suppress Chrome's native
  hover-triggered PiP button. Takes `videoSrc` (default `/Home.mp4`) and `imageSrc`
  (default `/Liz.jpg`) props. Positioned horizontally aligned with the page's H1 (the
  H1's section is `relative`; the avatar wrapper is
  `lg:absolute lg:left-[-9rem] lg:top-1/2 lg:-translate-y-1/2`), sitting in the gutter
  between the viewport's left edge and the navbar logo — outside the page's
  `max-w-7xl` content column — with `lg:z-[60]` so it renders above the sticky
  `Navbar` (`z-50`) instead of being clipped by it. Below `lg`, it stacks centered
  beneath the H1 instead. Rolled out with three image variants depending on page:
  `Liz.jpg` (Home, The AI Dilemma, Core Barriers, Coaching, About, the Modernization
  Agent, EU AI Act Compliance, Start Your Journey, Contact), `Clint.jpg` (AI Solution
  Categories overview and all five Solution Class detail pages, gated per-solution by
  the `heroAvatarEnabled`/`heroAvatarImage` fields on each `src/lib/solutions.ts`
  entry), and `Mary.jpg` (Our Methodology, Boost Point, Opportunity, Readiness, and
  the Modernization Journey). Pages whose hero section previously used a narrower
  container (`max-w-3xl` on Start Your Journey and Contact; `max-w-4xl` on the
  Solution Class detail pages) were widened to `max-w-7xl` so the avatar's
  left-gutter position lines up with every other page — the centered H1 renders
  identically either way. This pattern superseded the older "Intro text + video icon"
  pattern below on every page it was added to.
- **Intro text + video icon (superseded)** — the site's original pattern placed a
  small `RoadmapVideoButton` icon at the top-left of the page's intro paragraph
  (`iconClassName="h-9 w-auto"`, wrapped in a `shrink-0` container to prevent
  flex-shrink distortion), opening a page-specific explainer video in a modal. This
  has been fully replaced by the Hero avatar video pattern above on every page that
  used it; `RoadmapVideoButton` (`src/components/RoadmapVideoButton.tsx`) is no
  longer rendered anywhere in the codebase, though the component file remains. Kept
  here for historical reference only.
- **Flanking side CTAs** — on pages with a centered `max-w-4xl` (or `max-w-3xl`/`max-w-5xl`) content column and side elements, the side elements sit in `calc(50% - 26.5rem)` (or `calc(50% - 30rem)`) gutters, flanking the centered column without narrowing it. Two implementations, in increasing order of position stability: Solution Class detail pages (`SolutionDetail`) use an explicit `min-[1440px]:grid` with the intro text pinned to a fixed height (`min-[1440px]:h-72 min-[1440px]:overflow-hidden`) in row 1, and the sidebar nav / roadmap CTA placed in row 2 alongside the Value/Examples/Readiness/Roadmap Fit cards, with `min-[1440px]:items-start` — their Y-start is fixed, but they're still grid siblings of the cards row. Boost Point/Opportunity/Readiness vertex pages go one step further: the flanking `VertexTriadNav` and roadmap CTA are placed in the *same row* as the fixed-height (`lg:h-56`) intro text (row 1), not the cards row (row 2) — fully decoupling their position from the Four/Three Cards grid below, which varies in row count between vertex pages.
- **Overlay-link cards with a nested link** — Our Methodology's three pillar cards use a `<div>` with an absolutely-positioned full-card `<Link>` underneath (`z-0`, so clicking anywhere still navigates to the pillar page) and `pointer-events-none` on the title (`z-10`) so clicks on it still reach that overlay link. This exists because the Opportunity card's body text contains its own nested `<Link>` (the phrase "AI Solution" → `/solutions`), rendered above the overlay so it stays independently clickable — a plain wrapping `<Link>` can't contain another `<Link>`.
- **Zoom-from-icon open/close animation** — used by the RAGnify Chat widget: on open, the pane scales in from `scale-[0.05]`/`opacity-0` to full size over 550ms, with `transform-origin` set to the triggering icon's captured screen coordinates converted into the pane's own local coordinate space (`origin - pane position`, since CSS `transform-origin` pixel values are relative to the transformed element's own box, not the viewport), so it visually "grows out of" the icon regardless of where the pane itself sits. Closing reverses the same transition, same duration, anchored at the same origin point before the pane unmounts (via the phase state machine described in §10.1). Deliberately not built on the older `RoadmapVideoButton` modal-from-icon pattern (superseded, see above) — the chat pane is draggable/resizable and needs to persist across navigation, which a modal doesn't support.

---

# End of Specification
