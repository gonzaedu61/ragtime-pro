# Ragtime-Pro — Website Specification Document
This document defines the narrative, deterministic, and human‑readable specification of the Ragtime-Pro website.  
Claude Code must maintain this document and ensure it always reflects the current state of the codebase, architecture, content, design system, and authoritative documents.

---

# 1. Website Purpose & Positioning

**Transitional note:** every page has now been rebranded to Ragtime-Pro's AI-driven,
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
Purelymail mailbox) has not been updated to match the `info@ragtime.pro` address
used across the site's copy — see §8.4/§8.5.

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
Home is reached via the navbar logo/brand mark, not a nav item.
1. The AI Dilemma  
2. AI Solutions (nav label; page is "Solution Categories")  
3. Modernization Agent (nav label; page is "The Modernization Agent" — see PAGE 12)  
4. Our Methodology  
5. About Us (nav label; page is "About Ragtime-Pro" — see PAGE 11)  
6. EU Compliance (nav label; page is "EU AI Act Compliance")  
7. Start Your Journey  
8. Contact  

## 2.2 Footer Navigation
- Privacy Policy  
- Terms of Service  
- Contact  

**Pending:** a LinkedIn link was removed — Ragtime-Pro does not yet have a LinkedIn
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
  - Reasoning Agents — `/solutions/reasoning-agents`
  - Custom AI Models — `/solutions/custom-models`
- Our Methodology — `/methodology`
  - The Modernization Journey — `/methodology/process` (standalone route, linked from Our Methodology's "Check the steps ..." CTA; not in top nav)
  - Boost Point — `/methodology/boost-point` (standalone route, linked from Our Methodology's pillar cards; not in top nav)
  - Opportunity — `/methodology/opportunity` (standalone route, linked from Our Methodology's pillar cards; not in top nav)
  - Readiness — `/methodology/readiness` (standalone route, linked from Our Methodology's pillar cards; not in top nav)
- About Ragtime-Pro — `/about`
- The Modernization Agent — `/modernization-agent`
- Start Your Journey — `/start`
- Contact — `/contact`
- Privacy Policy — `/privacy-policy`
- Terms of Service — `/terms-of-service`
- EU AI Act Compliance — `/eu-ai-act-compliance` *(top-level nav item only — the Home
  page no longer links here after the Ragtime-Pro rebrand dropped the "EU Compliance
  Support" value block; not linked from the footer)*

---

# 3. Page-by-Page Specifications

## PAGE 1 — HOME

### Purpose
Immediate clarity: what Ragtime-Pro does, for whom, and why it matters.

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
  - Book an Intro Call → `/contact` (with the `discovery_call.svg` icon displayed
    beneath the button)

### Hero Visual
Removed. The Home hero no longer includes a separate large logo motif; the
flip-animated logo lockup now appears only in the navbar (see §10.1).

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
`Bubbles.svg` icon (`h-20`, fixed size — no hover zoom) with the caption "Better a
chat …?" (`text-lg text-charcoal`, stays black — no hover color change) beneath it,
right of the headline in the hero row above. On hover, the icon crossfades to
`Bubbles_blue.svg` (two absolutely-stacked `Image`s with opposing opacity
transitions — the same crossfade technique `SolutionDetail`'s sidebar uses for its
`icon`/`iconHover` pair, though that one also scales; this one deliberately doesn't),
rather than scaling or recoloring. On click, it captures its own screen position and
calls `open()` on
`ChatWidgetContext`, which the floating `ChatWidget` uses as the anchor point for its
zoom-in-from-icon opening animation and symmetric zoom-out-to-icon closing animation —
see §10.3 "Zoom-from-icon open/close animation" and §8.7. Home-only for this first
pass; more pages planned.

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
Ragtime-Pro's coaching is AI-augmented, powered by the Modernization Agent (first
mention is an inline `<Link>` → `/modernization-agent`), which performs the heavy
analytical work (scanning code, mapping dependencies, identifying Boost Points —
inline `<Link>` → `/methodology/boost-point` — evaluating integration paths,
assessing EU AI Act implications — inline `<Link>` → `/eu-ai-act-compliance`). The
consulting team brings modernization expertise, the vendor's team brings product
knowledge, and the Modernization Agent brings analytical acceleration. On the right,
the Ragtime-Pro logo (`Ragtime-Pro_Logo.png`) above a "We can help you …" link button
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
  roadmap …" link button → `/methodology`.

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
generated `<title>` now reads `{title} | Ragtime-Pro`.

### Example (RAG Solutions)
- Quote: “Users no longer search for answers — the product provides them.”
- Overview: “RAG represents a pivotal moment in any product's modernization journey — the point where it stops being a static tool and starts behaving like an intelligent assistant, capable of understanding context and retrieving relevant knowledge. Legacy products often sit on extensive documentation, domain-specific rules, and tribal knowledge held by long-time engineers — valuable, but inaccessible. Users must search manually, ask colleagues, or rely on support teams. RAG solves this by embedding that knowledge directly into the product, so users no longer search for answers — the product provides them. For many vendors, this is the single most transformative modernization step.”

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
4. Standard Ragtime-Pro Modules Mapping — matches each opportunity to Ragtime-Pro's
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

## PAGE 11 — ABOUT RAGTIME-PRO

### Purpose
Build trust by explaining Ragtime-Pro's modernization system as a whole — the
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
introducing Ragtime-Pro
as a modernization partner for legacy software vendors, transforming mission-critical
products without rewrites or disruptive architectural change, through a combination of
AI-augmented analysis, structured methodology, expert consulting, and incremental AI
Upgrade Modules. On the right, the `mail_icon.svg` icon above a "Contact us …" link
button → `/contact`. Same layout pattern as the intro text + icon/button groups on The
AI Dilemma, Core Barriers, and Coaching pages. Intro text opens "Ragtime-Pro is a
modernization partner for European software vendors ..." — "European" added to align
with the site's EU-focused positioning.

### Sections
- Our Modernization Agent — linked card (`<Link>`, `ExternalLinkIcon`, hover-lift
  state) → `/modernization-agent`
- The Product Modernization Triad — linked card → `/methodology`
- The Consulting Layer — linked card → `/methodology/process`
- AI Upgrade Modules — linked card → `/solutions`

The four pillars of Ragtime-Pro's "precision-engineered system," per the PDF chapter's
"What Makes Us Different" section. All four cards link out, same linked-card pattern as
the Home value blocks and Solution Class cards (see §10.3 Shared Visual Patterns).

### Quote
“We are not a generic AI consultancy. We are a modernization partner.”

---

## PAGE 12 — THE MODERNIZATION AGENT

### Purpose
Explain the Modernization Agent: Ragtime-Pro's proprietary AI system and the internal
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
   existing standard Ragtime-Pro AI Modules (inline `<Link>` → `/solutions`) or develop
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
ambitions, so engagement with Ragtime-Pro (inline `<Link>` → `/about`) begins not with
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
info@ragtime.pro. Also updated on Privacy Policy and Terms of Service (see PAGE 16
and PAGE 17). The `/api/contact` route itself has no hardcoded address (reads
`MAIL_FROM_ADDRESS` / `MAIL_INFO_ADDRESS` from env — see §8.4); those production
values, and the underlying Purelymail mailbox, have not been updated to match.

---

## PAGE 15 — EU AI ACT COMPLIANCE

### Purpose
Explain what the EU AI Act requires of software vendors integrating AI into legacy
products, and how Ragtime-Pro builds compliance into every modernization roadmap.
Content is grounded in the PDF's Core Barriers ("Barrier 4 — Compliance & Ethics")
and Coaching ("Breaks Barrier 4") chapters, supplemented with current, externally
researched EU AI Act specifics (risk-tier definitions, obligation deadlines, and
penalty figures) since the PDF itself does not contain a dedicated compliance
chapter. Formerly expanded on a dedicated Home "EU Compliance Support" value block;
Home no longer includes one after the Ragtime-Pro rebrand, so this page is now
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
Fully rebranded: entity name and positioning updated throughout (Ragtime-Pro is a
modernization partner combining the Modernization Agent with expert consulting,
replacing the prior "European network of AI consultants helping SMEs" framing); no
PDF chapter exists for legal boilerplate, so this was a terminology/positioning
rebrand rather than a PDF-sourced content rewrite. "Last updated" bumped to August
10, 2026.

### Content
No quote band. A centered H1 + "Last updated" date, then a single-column list of
sections: Who we are; Information we collect (drawn from the actual Contact form
fields — name, company, email, message, optional phone, optional AI modernization
interest — and noting the site uses no cookies or analytics); How we use your
information (references "an introductory consultation", matching the Start Your
Journey page's phase terminology); Legal basis for processing; Sharing your
information (rewritten to drop the BrokerAI-era "specialist within our network"
brokerage language — Ragtime-Pro delivers directly, it doesn't broker third-party
vendors — replaced with generic "service providers who help us operate this website");
Data retention; Your rights (GDPR); Changes to this policy; Contact us (mailto link,
`info@ragtime.pro`).

## PAGE 17 — TERMS OF SERVICE

### Purpose
Footer/legal page governing use of the website (a separate signed agreement governs
any actual consulting engagement). Fully rebranded, same terminology/positioning
rebrand as Privacy Policy. "Last updated" bumped to August 10, 2026.

### Content
No quote band. Same layout as Privacy Policy: centered H1 + "Last updated" date, then
sections: Acceptance of these terms; About our services (Ragtime-Pro's modernization-
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
network no longer applies. Ragtime-Pro is not a broker; per the PDF, it directly
delivers modernization through its own Modernization Agent, consultants, and AI
Upgrade Modules, with no third-party vendor referrals in its model. The clause was
removed rather than reworded, since keeping any form of it would misrepresent how
the business actually operates. Flagged explicitly to the user as a legal-substance
change, not just a terminology swap.

---

# 4. Visual Identity Specification

## 4.1 Logo
Use the Ragtime-Pro lockup (`public/Ragtime-Pro_Logo.png`) — three ascending equalizer
bars (the "AI" mark) paired with the "RAGTIME-PRO" wordmark — as the brand symbol.

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
- Ragtime Chat widget — draggable/resizable floating pane that zooms open from and closed back into its trigger icon's screen position (Home only, for now)

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

**Favicon:** `src/app/icon.png` — a copy of `public/favicon.png` (the equalizer-bar
icon mark only, no wordmark), picked up automatically by Next.js's App Router file
convention (no code in `layout.tsx` needed). Site-wide, not per-page.

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
- **AI-generated acknowledgement:** `src/lib/aiReply.ts` calls Azure OpenAI
  (via the `openai` package's `AzureOpenAI` client, imported from
  `openai/azure`) against the `AZURE_OPENAI_ENDPOINT` resource — deployment
  `o4-mini`, api version `2024-12-01-preview`, authenticated with
  `AZURE_AI_PROJECT_API_KEY` (a 25s timeout). It sends a prompt built from the
  submitter's name, company (optional), email, phone, AI modernization
  interest, and message, asking for a JSON response (`personalizedReply`,
  `replySubject`), auto-detecting and replying in the visitor's own language.
  The prompt describes Ragtime-Pro as a modernization partner combining the
  Modernization Agent with expert consulting (rebranded from the prior "The
  BrokerAI, a consulting firm that helps SMEs adopt AI" framing), and signs
  off as "The Ragtime-Pro Team". If the call fails, times out, or the
  response doesn't parse into valid, non-empty JSON, `generateAiReply`
  returns `null` and the route falls back to a fixed acknowledgement text
  and subject (also rebranded — sender name "Ragtime-Pro", fallback subject
  "We've received your message — Ragtime-Pro", fallback body referencing
  "modernize your product").
- **Shared send helper:** `src/lib/acknowledgement.ts` exports
  `sendAcknowledgement()`, which calls `generateAiReply` and sends the
  resulting (or fallback) text via the Nodemailer transporter, from
  `MAIL_FROM_ADDRESS`, bcc'd to `MAIL_INFO_ADDRESS` so the actual
  outgoing acknowledgement is visible internally without exposing that
  address to the visitor. Both the contact form route and the inbox-poll
  route (§8.5) call this single function, so the acknowledgement logic
  (and the bcc) is defined once.
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
  headers: `MAIL_FROM_ADDRESS` (the "From" on both outgoing emails, currently
  `noreply@thebrokerai.tech` in production) and `MAIL_INFO_ADDRESS` (the "To"
  on the internal notification email and the "Bcc" on every acknowledgement
  email, currently `info@thebrokerai.tech` in production).
  `MAIL_ACK_BLOCKLIST` (comma-separated addresses that are never
  acknowledged; see §8.5) is also part of this group. **Note:** website copy
  (Contact, Privacy Policy, Terms of Service) now displays `info@ragtime.pro`
  and `.env.local.example`'s `PURELYMAIL_SMTP_USER` placeholder has been
  updated to match, but the actual Vercel production env vars and Purelymail
  mailbox still need to be provisioned/updated separately — this repo cannot
  do that.

## 8.5 Inbox Polling & Auto-Acknowledgement
- **Purpose:** automatically sends the same AI-generated acknowledgement
  (§8.4) to anyone who emails the configured info address directly (currently
  `info@thebrokerai.tech` in production — see note in §8.4), not just
  visitors who use the Contact form.
- **API route:** `src/app/api/inbox-poll/route.ts` — a `GET` Route Handler,
  protected by a shared secret: the request must include
  `Authorization: Bearer <INBOX_POLL_SECRET>` or it returns `401`.
  `export const maxDuration = 60`.
- **IMAP polling:** on each invocation, connects via `imapflow` to
  `PURELYMAIL_IMAP_HOST:PURELYMAIL_IMAP_PORT` (Purelymail,
  `imap.purelymail.com:993`) authenticated with `PURELYMAIL_IMAP_USER` /
  `PURELYMAIL_IMAP_PASS` (a separate Purelymail account/password for the
  info address, distinct from the `noreply@` SMTP credentials in §8.4).
  Opens `INBOX`, searches for unseen messages (capped at 10 per run),
  downloads and parses each with `mailparser`, and immediately marks it
  `\Seen` so a later failure doesn't cause it to be reprocessed forever.
- **Loop/spam guard:** a message is skipped (still marked `\Seen`, but no
  acknowledgement sent) if its sender address is in `MAIL_ACK_BLOCKLIST`
  (comma-separated env var, defaults to the site's own sending addresses —
  currently `noreply@thebrokerai.tech`, `info@thebrokerai.tech` in
  production) or if it carries an
  `Auto-Submitted` header other than `no` (autoresponders, bounces). This
  exists specifically to prevent an acknowledgement from triggering another
  acknowledgement in an infinite loop.
- **Acknowledgement:** for each message that passes the guard, calls the
  shared `sendAcknowledgement()` (§8.4) with the sender's display name (or
  address local-part as fallback), email address, and the message body as
  the "message" field. Company/phone/AI-interest are left unset.
- **Response:** returns `{ processed, acknowledged, skipped }` as JSON.
- **Trigger:** this route is not called by Vercel Cron — the Hobby plan
  limits Vercel's own Cron Jobs to once per day, too infrequent for this
  purpose. Instead it's triggered by an external free scheduler,
  **cron-job.org**, configured to `GET` this route once per minute with the
  `Authorization` header set to the `INBOX_POLL_SECRET` value. This keeps the
  polling entirely outside Vercel's native Cron product while remaining free.
- **Environment variables:** `PURELYMAIL_IMAP_HOST`, `PURELYMAIL_IMAP_PORT`,
  `PURELYMAIL_IMAP_USER`, `PURELYMAIL_IMAP_PASS`, `INBOX_POLL_SECRET` — same
  storage rules as §8.4 (documented blank in `.env.local.example`, real
  values in gitignored `.env.local` / Vercel project settings).

## 8.6 Deployment & Production Promotion
- **Hosting:** Vercel project `thebrokerai` (team `the-broker-ai`), linked to
  the `gonzaedu61/ragtime-pro` GitHub repository. *(Vercel project/team names
  unconfirmed — not yet verified as renamed; only the GitHub repo name is
  confirmed current.)*
- **No auto-deploy on `main`:** `vercel.json` sets
  `git.deploymentEnabled.main` to `false`, so pushes to `main` no longer
  trigger an automatic Vercel build or deployment (production or preview).
  This aligns with CLAUDE.md §10.2 ("deploy only when explicitly
  instructed"). Other branches are unaffected and still get preview
  deployments on push.
- **Manual production deploys:** shipping a change now requires an explicit
  `vercel --prod` (or a manual "Redeploy" from the Vercel dashboard) run
  against the current `main`.
- **Production domain:** `thebrokerai.tech` (custom domain, apex +
  `www`), aliased to the underlying `thebrokerai.vercel.app` Vercel
  deployment URL.
- **DNS:** domain is registered with a third-party registrar and DNS is
  managed via HostGator (not Vercel-managed nameservers). Required
  records: apex `A @ 76.76.21.21`, `www` `CNAME` to Vercel's assigned
  `vercel-dns` target. Vercel auto-issues and renews the TLS
  certificate for both hostnames once DNS verification succeeds — no
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
The Ragtime Chat widget (§10.1, §10.3, Page 1) is backed by a fully
serverless Retrieval-Augmented Generation pipeline — static local corpus
(chunking, embeddings, BM25 index, cross-encoder re-ranking), Cloudflare R2
conversation memory, and Azure OpenAI for answer generation and
summarization. Full design record, implementation notes, and QA evals live
in `docs/rag-implementation-spec.md` (not duplicated here). API surface:
- `POST /api/rag/answer` — the main chat endpoint: retrieves + reranks
  context, calls Azure OpenAI, appends the turn to R2, returns the answer.
- `GET /api/rag/session` / `POST /api/rag/session/confirm` — session
  resolution and the returning-visitor confirmation flow the widget uses on
  first open.
- `POST /api/rag/retrieve` — retrieval-only endpoint (no answer generation),
  used for testing the retrieval pipeline in isolation.

Reuses the same Azure OpenAI credentials/deployment as the contact-form
auto-reply (§8.4) via its own client instance (`src/rag/azureClient.ts`),
not a shared module — see `docs/rag-implementation-spec.md` §11 for why.

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
- **Navbar** (`src/components/Navbar.tsx`) — sticky top navigation; renders the 8 top-level nav items (Home is reached via the logo/brand mark, not a nav item), logo, and mobile menu toggle. Desktop nav shows at the `xl` breakpoint and above; below that it falls back to the hamburger menu. The logo is the `Ragtime-Pro_Logo.png` lockup (icon + wordmark, no separate text label), flip-animated in an 82×170px box sized to its aspect ratio.
- **Footer** (`src/components/Footer.tsx`) — footer navigation (Privacy Policy, Terms of Service, Contact) and copyright line. No LinkedIn link yet — see §2.2.
- **RotatingHeadline** (`src/components/RotatingHeadline.tsx`) — client component cycling through 5 two-line phrases on the Home hero, one every 8 seconds with a cross-fade transition. Starts on a random phrase on each mount (not always the first) so repeat visits and refreshes don't always open on the same line.
- **HeroAvatarVideo** (`src/components/HeroAvatarVideo.tsx`) — clickable circular avatar photo that plays an in-place explainer video with custom minimal controls; positioned in the left gutter beside each page's H1. See §10.3 "Hero avatar video" for full behavior, positioning, and the per-page image/video assignments.
- **RoadmapVideoButton** (`src/components/RoadmapVideoButton.tsx`) — reusable video-icon trigger; renders a small icon (optionally with a text label) that opens a centered modal video player animating in/out from the icon's screen position. Takes a `src` (defaults to the AI Roadmap Guide video), an optional `lowBandwidthSrc` for connection-aware source switching, and a `blueHoverIcon` toggle (icon swaps to an electric-blue variant on hover; disabled on Home and Start Your Journey, where a size-only hover effect is used instead). **No longer used anywhere** — every page that rendered it now uses `HeroAvatarVideo` instead (see §10.3); the component file remains in the repo but has zero call sites.
- **VertexTriadNav** (`src/components/VertexTriadNav.tsx`) — small Driving-Triad diagram used in the left-side nav slot on the Need/Opportunity/Readiness pages; highlights the current vertex and links to the other two.
- **SolutionDetail** (`src/components/SolutionDetail.tsx`) — shared template rendering a single Solution Class's Quote, Overview, sidebar of the other four categories, Value/Examples/Readiness Requirements/Roadmap Fit cards, and a roadmap CTA; used by the dynamic `/solutions/[slug]` route. See Page 6 for its 3-column grid layout.
- **ExternalLinkIcon** (`src/components/ExternalLinkIcon.tsx`) — small inline SVG "leads elsewhere" arrow icon (hand-drawn, no external asset). Used on every card that is itself a link, positioned bottom-right; see Section 10.3.
- **ChatWidgetContext** (`src/components/chat/ChatWidgetContext.tsx`) — React context holding the chat widget's open/closed state and the screen-position "origin" of whichever trigger opened it (used for the zoom animation). Provider is mounted once at the root layout (`src/app/layout.tsx`), wrapping the whole site, so widget state survives page navigation.
- **ChatWidget** (`src/components/chat/ChatWidget.tsx`) — the floating chat pane: draggable/resizable (`react-rnd`; min 320×380px, max 50% of viewport width/height, recomputed on window resize), a navy header ("Ragtime Chat", left-aligned) doubling as the drag handle, a thin custom-scrollbar message list, and an input box wired to `POST /api/rag/answer`. Renders nothing when closed; open/close plays a zoom animation anchored to the trigger's screen position via a `hidden → entering → shown → exiting → hidden` phase state machine, so the closing transition finishes before unmounting. Position and size are local component state — since the component is mounted once at the root layout and never unmounts (only its rendered output toggles), they survive both page navigation and close/reopen. On first open, checks `GET /api/rag/session` for a returning-visitor match and shows a "continue where you left off?" prompt when found. See §8.7 for the backend it talks to.
- **ChatBubbleTrigger** (`src/components/chat/ChatBubbleTrigger.tsx`) — the `Bubbles.svg` + "Better a chat …?" button that opens the widget; see Page 1 "Chat Trigger". Currently Home-only.

## 10.2 Content Data Sources
- `src/lib/solutions.ts` — single source of truth for the 5 Solution Class entries (including each solution's `quote`), consumed by both the `/solutions` overview cards and the `/solutions/[slug]` detail pages. Also carries the optional `heroAvatarEnabled` (boolean gate) and `heroAvatarImage` (image override) fields that control the Hero Avatar Video on each detail page — see §10.3 "Hero avatar video" and Page 6.

## 10.3 Shared Visual Patterns
- **Navy pull-quote bar** — a slim `bg-navy py-8` band holding one italic, centered quote (`text-2xl font-medium italic text-white`), placed directly beneath each page's H1 hero. Used on every page except Home. Quotes are sourced verbatim from the AI Roadmap Guide PDF (Section 12 authoritative source), one per page — see each page's "Quote" entry in Section 3.
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
- **Zoom-from-icon open/close animation** — used by the Ragtime Chat widget: on open, the pane scales in from `scale-[0.05]`/`opacity-0` to full size, with `transform-origin` set to the triggering icon's captured screen coordinates, so it visually "grows out of" the icon. Closing reverses the same transition anchored at the same origin point before the pane unmounts (via the phase state machine described in §10.1). Deliberately not built on the older `RoadmapVideoButton` modal-from-icon pattern (superseded, see above) — the chat pane is draggable/resizable and needs to persist across navigation, which a modal doesn't support.

---

# End of Specification
