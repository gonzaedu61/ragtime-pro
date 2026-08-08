# Ragtime-Pro — Website Specification Document
This document defines the narrative, deterministic, and human‑readable specification of the Ragtime-Pro website.  
Claude Code must maintain this document and ensure it always reflects the current state of the codebase, architecture, content, design system, and authoritative documents.

---

# 1. Website Purpose & Positioning

**Transitional note:** Home has been rebranded to Ragtime-Pro's AI-driven,
legacy-software-modernization positioning. The remaining pages described below
(About, The AI Dilemma, Engagement Model, etc.) still reflect the prior general
"SME AI adoption" positioning and copy, and will be reconciled page by page as each is
rebranded. Our Methodology (including its new Modernization Journey subpage) has been
rebranded, as have the Boost Point (routed at `/methodology/boost-point` — see PAGE 8)
and Opportunity (see PAGE 9) vertex subpages; the Readiness vertex subpage has not yet.
Solutions is partially rebranded — its five overview-card teasers now reflect the
Opportunity vertex's AI Upgrade Module framing, but its titles, quote/intro text, and
detail-page content have not (see PAGE 5).

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
3. Modernization Agent (nav label; page is "Engagement Model", pending its own
   rebrand — see §1 transitional note)  
4. Our Methodology  
5. About Us (nav label; page is "About The BrokerAI")  
6. EU Compliance (nav label; page is "EU AI Act Compliance")  
7. Start Your Journey  
8. Contact  

## 2.2 Footer Navigation
- Privacy Policy  
- Terms of Service  
- Contact  

**Pending:** a LinkedIn link was removed — The BrokerAI does not yet have a LinkedIn
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
- About The BrokerAI — `/about`
- Engagement Model — `/engagement-model`
  - Value-Centered Layers — `/engagement-model/value-centered-layers` (standalone route, linked from Engagement Model's "See the value-centered layers ..." button; not in top nav)
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
  the capacity to make it happen.", "If customer satisfaction is losing momentum… we
  help your product win their hearts again", "If AI modernization feels overwhelming…
  we make it simple and doable".
- **Subheadline:** A safe, structured, and high‑impact approach to AI‑driven
  modernization for legacy software products.
- **CTAs:**  
  - Book an Intro Call → `/contact` (with the `discovery_call.svg` icon displayed
    beneath the button)
  - "Watch the AI-Roadmap-Guide video" — a `RoadmapVideoButton` that opens the AI
    Roadmap Guide video in a modal (not a download)

### Hero Visual
Removed. The Home hero no longer includes a separate large logo motif; the
flip-animated logo lockup now appears only in the navbar (see §10.1).

### Key Value Blocks
Each block links to the page that expands on it. Grid order (2 columns: top-left,
top-right, bottom-left, bottom-right):
1. We Bring Structure → `/methodology`
2. Our Modernization Agent → `/about`
3. Incremental Modernization → `/engagement-model`
4. AI Upgrade Modules → `/solutions`

---

## PAGE 2 — THE AI DILEMMA

### Purpose
Explain the problem SMEs face.

### Quote
“AI adoption is not a choice — but the path forward feels risky and uncertain.”

### Intro Text + Icon/CTA (below quote, above cards)
A centered two-column group (stacks on mobile): on the left, a video icon
(`RoadmapVideoButton`, playing `The_AI_Dilema.mp4`) beside intro text on AI adoption
for SMEs being full of interest and noise but rarely clarity, the accessibility of
tools outpacing the sense of where to start, and more than 75% having already tried
something without turning it into lasting value. On the right, the `barriers.svg`
icon above a "Know the barriers …" link button → `/ai-dilemma/barriers`. Same layout
pattern as the intro text + icon/button groups on the other AI Roadmap pages.

### Sections
- Accessible, but unclear  
- Experimentations without value  
- Feeling the pressure  
- Stuck in a paradox  

---

## PAGE 3 — CORE BARRIERS

### Purpose
Show empathy and expertise by naming the four barriers.

### Quote
“These barriers are real — but they are also solvable.”

### Intro Text + Icon/CTA (below quote, above cards)
A centered two-column group (stacks on mobile): on the left, a video icon
(`RoadmapVideoButton`, playing `The_Core_Barriers.mp4`) beside intro text opening with
the former hero subheadline ("Four barriers consistently stand between SMEs and
confident AI adoption"), then drawing on the AI Roadmap Guide's "Core Barriers"
section — the barriers as natural consequences of limited resources and lean teams
rather than weakness, the motivated-but-constrained paradox, and that structured
guidance and coaching make them solvable one at a time. On the right, the
`broken_barrier.svg` icon above a "Break the barriers …" link button →
`/ai-dilemma/coaching`. Same layout pattern as The AI Dilemma page's intro
text + barriers icon/button group.

### Four Barrier Cards
1. **Cost Perception** — “Fear of choosing wrong becomes a financial barrier.”  
2. **Skills Gap**  
3. **Organizational Resistance**  
4. **Compliance & Ethics**  

---

## PAGE 4 — COACHING: THE BARRIER’S BREAKER

### Purpose
Explain the core service: structured coaching.

### Quote
“Coaching turns uncertainty into a structured and confident path toward value.”

### Intro Text + Icon/CTA (below quote, above cards)
A centered two-column group (stacks on mobile): on the left, a video icon
(`RoadmapVideoButton`, playing `Barriers_Breaker.mp4`) beside intro text opening with the
former hero subheadline ("Structured coaching is how The BrokerAI turns each core barrier
into a solved problem"), then drawing on the AI Roadmap Guide's "Coaching: The Barrier's
Breaker" section — the real challenge being uncertainty rather than the technology itself,
coaching replacing guesswork with methodology and fragmented experimentation with strategic
alignment, and working barrier by barrier to demystify AI, build skills, reduce resistance,
and keep recommendations aligned with the EU AI Act. On the right, the Ragtime-Pro logo
(`Ragtime-Pro_Logo.png`) above a "We can help you …" link button → `/about`. Same layout pattern as The
AI Dilemma and Core Barriers pages' intro text + icon/button groups.

### Key Blocks
- Demystification  
- Bridging the skills gap  
- Reducing resistance  
- Ensuring compliance  
- Building Confidence (second row, alongside Ensuring Compliance)  

---

## PAGE 5 — AI SOLUTION CATEGORIES

### Purpose
Introduce the 5‑tier model.

### Quote
“AI adoption is not a binary choice. It is a path to select the right solution at the
right time.” *(kept on one line via `lg:whitespace-nowrap` on wide viewports)*

### Intro Text + Icon/CTA (below quote, above cards)
A centered two-column group (stacks on mobile): on the left, a video icon
(`RoadmapVideoButton`, playing `AI_Solutions.mp4`) beside intro text summarizing the
five-tier framing plus the AI Roadmap Guide's "AI Solution Classes" section — AI as a broad
ecosystem of capabilities rather than one technology, why organizations without a
structured map start in the wrong place, and how the five classes organize the landscape by
complexity, integration, and strategic impact. On the right, a roadmap icon (`roadmap.svg`)
above a "Setting the roadmap …" link button → `/methodology`. Same layout pattern as the
intro text + icon/button groups on the other AI Roadmap pages.

### Five Cards
1. Personal Productivity  
2. Intelligent Workflows  
3. RAG Solutions  
4. Reasoning Agents  
5. Custom AI Models  

**Partial rebrand:** each card's `teaser` in `src/lib/solutions.ts` (the overview grid
copy) has been aligned with the Product Modernization Triad's Opportunity vertex — quick
wins, operational efficiency, knowledge leverage, real-time intelligence, competitive
differentiation, matching the outcome each maps to as an AI Upgrade Module category (see
PAGE 9). Titles, the page's own quote/intro text, and every solution's deeper detail-page
content (`definition`, `overview`, `quote`, `smeValue`, `examples`,
`readinessRequirements`, `roadmapFit`) still reflect the prior general "SME AI adoption"
positioning and have not been rebranded yet.

---

## PAGE 6 — SOLUTION CLASS DETAIL PAGES

Rendered by the shared `SolutionDetail` component for each `/solutions/[slug]` route.
On wide viewports (`lg` and up) the page below the quote is a 3-column CSS grid —
sidebar | center content | roadmap CTA — matching the width of the flanking CTAs
used elsewhere (`calc(50% - 26.5rem)` gutters either side of a centered `max-w-4xl`
column). Below `lg`, all three stack into a single column in the order: intro,
sidebar, cards, roadmap CTA.

### Structure
- Hero: solution title only (no subheading)  
- Quote (per-solution pull-quote, stored as `quote` on each entry in `src/lib/solutions.ts`)  
- **Center, row 1 — Intro block:** a video icon (`RoadmapVideoButton`, playing the
  solution's `video` field) beside the overview paragraph (`overview` field), with an
  optional solution icon (`icon` field) to the right. This block has a fixed height
  (`lg:h-72`, clipped via `overflow-hidden`) on wide viewports so that switching
  between solutions never shifts the sidebar or roadmap CTA below it vertically,
  regardless of how long a given solution's overview text is.
- **Left, row 2 — Sidebar:** the other four Solution Classes, each as an icon (hover
  swaps to the `iconHover` variant) + title link to its own detail page. No heading
  label above the list. Icon size defaults to `h-16 w-10` but is tuned per solution
  where needed (currently: Personal Productivity smaller at `h-14 w-9`, Reasoning
  Agents larger at `h-[4.5rem] w-[2.75rem]`). Rows are left-aligned relative to each
  other at every viewport width (`items-start`, no responsive override), but the list
  itself is a `w-fit mx-auto` block below `lg` so the whole group sits horizontally
  centered in the viewport rather than stuck to the left edge — resets to
  `lg:w-auto lg:mx-0` at `lg` and up, where the outer `<nav>`'s own `justify-center`
  already centers it within the sidebar gutter.
- **Center, row 2 — Four cards** arranged two-by-two below the intro block: Value
  (`smeValue`), Examples (`examples`), Readiness Requirements
  (`readinessRequirements`), Roadmap Fit (`roadmapFit`).
- **Right, row 2 — Roadmap CTA:** the `roadmap.svg` icon above a "Setting the
  roadmap …" link button → `/methodology`.

### Example (RAG Solutions)
- Quote: “Combine AI reasoning with the pulling of the right information from your trusted sources.”
- Overview: “AI becomes a knowledge assistant that operationalizes the organization's collective intelligence. It is the moment when AI begins to understand the business, not just automate its tasks. By grounding assistants in internal documentation, RAG solutions make the organization's own knowledge instantly searchable and usable, cutting the time lost hunting for answers. It's a mid-roadmap step: once workflows are automated, RAG unlocks the knowledge base sitting behind them.”

---

## PAGE 7 — OUR METHODOLOGY (Product Modernization Triad)

### Purpose
Explain the strategic framework.

### Quote
“Legacy modernization is not a matter of inspiration or experimentation. It is a strategic discipline.”

### Intro Text + Diagram + Steps CTA (below quote, above cards)
A centered three-column row (stacks on mobile; vertically centered at `lg` and up).
On the left, the Steps CTA — the `steps.svg` icon above a "Check the steps ..." link
button, → `/methodology/process`, pointing readers to the eight-step Modernization
Journey (see PAGE 7A). In the middle, a video icon (`RoadmapVideoButton`, playing
`Our_Methodology.mp4`) beside intro text explaining the Product Modernization Triad —
Boost Point, Opportunity, and Readiness — and how it keeps every recommendation checked
against where AI can create the highest value, the AI Upgrade Module that fits best, and
the product's actual readiness to integrate it safely, continuously adapted by the
Modernization Agent as the product evolves. The first mention of "Product Modernization
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

### Quote
“Turning AI modernization from a risky leap into a guided evolution.”

### Intro Text (below quote, above steps)
A centered paragraph (no video — no dedicated video asset exists for this page yet)
explaining that legacy modernization is a strategic discipline, not a matter of
inspiration or experimentation, and that the methodology follows a structured,
repeatable sequence powered by the Modernization Agent and executed by the
consultants.

### Eight Steps
1. Product Discovery & Context Mapping
2. Modernization Opportunity Analysis
3. AI Solution Category Alignment
4. Standard Ragtime-Pro Modules Mapping — matches each opportunity to Ragtime-Pro's
   library of pre-built AI Upgrade Modules, reusing one where it fits or generating a
   new module for any gap.
5. Modernization Sequencing
6. Risk & Compliance Assessment
7. Modernization Blueprint Creation
8. Guided Implementation

Same visual pattern as the Engagement Model's six-step grid (icon + title + body per
card, no per-card links, no numeric prefix in the title since each numbered icon,
`step_1.svg`–`step_8.svg`, already carries its step number). The first six cards sit
in a standard `<ol>` grid (`sm:grid-cols-2 lg:grid-cols-3`); cards 7 and 8
(Modernization Blueprint Creation, Guided Implementation) form a second `<ol>` below
it, sized to match the grid's column width but laid out with `flex justify-center`
so the pair centers as a group under the row above instead of sitting flush-left.

### Back CTA
Below the steps grid, the `roadmap.svg` icon above a "See the driving Triad ..." link
button → `/methodology`.

---

## PAGE 8 — BOOST POINT

### Purpose
Explain the first vertex of the Product Modernization Triad: the modernization hotspot
where AI can create the highest product value with minimal disruption.

### Quote
“The point in the product where AI can create high value with minimal disruption.”

### Main Text (below quote, above cards)
A centered paragraph explaining that a Boost Point is a modernization hotspot identified
by the Modernization Agent through multi-dimensional analysis of source code,
documentation, workflows, customer usage patterns, industry constraints, integration
landscape, pain points, and competitive gaps — and that anchoring modernization in Boost
Points ensures every AI Upgrade Module targets a real, high-value opportunity rather than
the flashiest technology. The first mention of "Boost Point" is bolded. Fixed height
(`lg:h-56 lg:overflow-hidden`) so the flanking nav/CTA beside it land at the same vertical
position regardless of paragraph length — see Flanking Nav/CTA.

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
Explain the third Driving-Triad vertex: the technical, organizational, financial, and
governance capacity to adopt and sustain a given solution.

### Quote
“Ensures the AI adoption at a pace that fits reality — not faster, not slower.”

### Main Text (below quote, above cards)
A centered paragraph explaining that Readiness is often the most overlooked dimension — a
business may have a clear need and opportunity but lack the data quality, process stability, or
internal skills to implement a solution effectively, and that Readiness paces adoption to the
organization's actual capacity to execute and sustain it.

### Four Cards
1. Technical Capability
2. Organizational Capability
3. Financial Capability
4. Governance Capability

### Flanking Nav/CTA
Same pattern as the Boost Point page: `VertexTriadNav` (now displaying the Product
Modernization Triad diagram — see PAGE 8) on the left, roadmap CTA on the right.

---

## PAGE 11 — ABOUT THE BROKERAI

### Purpose
Build trust.

### Intro Text + Icon/CTA (below quote, above cards)
A centered two-column group (stacks on mobile): on the left, a video icon
(`RoadmapVideoButton`, playing `We_Can_Help.mp4`) beside intro text explaining that
organizations struggle with AI because the journey is unclear, not because the technology is
complex, and introducing The BrokerAI as a vendor-neutral European multi-disciplinary
network. On the right, the `mail_icon.svg` icon above a "Contact us …" link button →
`/contact`. Same layout pattern as the intro text + icon/button groups on The AI Dilemma,
Core Barriers, and Coaching pages.

### Sections
- Mission  
- Skills Network  
- Vendor‑Neutral  
- Regulatory Expertise  

### Quote
“We are not a vendor. We are a strategic partner.”

---

## PAGE 12 — VALUE‑CENTRIC MODEL

### Purpose
Explain the engagement model.

### Quote
“Understanding the organization and evolving through continuous value delivery.”

### Intro Text + CTA (below quote, above the six step cards)
A centered two-column group (stacks on mobile): on the left, a video icon
(`RoadmapVideoButton`, playing `Engagement_Model.mp4`) beside intro text summarizing the
AI Roadmap Guide's "A Value-Centric Model" section — adoption as a structured
transformation rather than a technology experiment, walking through discovery, roadmap
blueprinting via the Driving-Triad, vendor brokerage, change management, and compliance
guidance, tied together by a continuous ROI feedback loop. On the right, the
`value_layers.svg` icon above a link button, "See the business value layers …" →
`/engagement-model/value-centered-layers`.

### Six Steps
1. Structured discovery  
2. Roadmap blueprinting  
3. Vendor brokerage  
4. Change management  
5. Compliance guidance  
6. Continuous ROI tracking  

---

## PAGE 13 — VALUE-CENTERED LAYERS

### Purpose
Explain the three layers of value the engagement model delivers, per the AI Roadmap
Guide's "value-centric model" section.

### Quote
“ROI tracking at key value layers — from daily operations to long-term
differentiation.” *(kept on one line via `lg:whitespace-nowrap` on wide viewports)*

### Main Text (below quote, above cards)
A centered paragraph explaining Operational, Strategic, and Transformational value in
sequence — immediate day-one gains, followed by sharper decision-making and resilience,
followed by proprietary capabilities and new business models.

### Three Cards
1. Operational  
2. Strategic  
3. Transformational  

### Flanking CTAs (left/right of the main text + cards, `lg` and up)
Left: the `roadmap.svg` icon above a "Setting the roadmap …" link button →
`/methodology`. Right: the `steps.svg` icon (nudged toward the bottom of its box via
`items-end`, closer to the button below it) above a "Check the steps …" link button →
`/engagement-model`. Both flank the centered content via `calc(50% - 26.5rem)` gutters.

---

## PAGE 14 — STARTING THE JOURNEY

### Purpose
Conversion page.

### Quote
“The first step in any AI journey should not be a technology purchase — it should be a conversation.”

### Intro Text (below quote, above CTAs)
A video icon (`RoadmapVideoButton`, playing `Starting_The_Journey.mp4`) sits at the
top-left of the intro text, which summarizes the AI Roadmap Guide's "Starting the Journey
Together" section: starting an AI journey is exciting but daunting, The BrokerAI's
understanding-first approach, the Driving-Triad grounding every recommendation, and the
partnership (not vendor) framing carried through discovery, roadmap design, pilot
selection, and scaling.

### CTAs
- Book a Discovery Call → `/contact`
- "Watch the full AI-Roadmap-Guide video" — a `RoadmapVideoButton` that opens the AI
  Roadmap Guide video in a modal (not a download)

---

## PAGE 15 — CONTACT

### Quote
“We are prepared to support you from the very first question.”

### Layout
Two-column below the quote (stacks to one column on mobile): left column holds an
enriched invitation to describe what the visitor needs or wants, in their own words,
plus the direct email fallback (larger, italic, with the `mail_icon.svg` icon inline to
its right); right column holds the form (or the "Thank you" confirmation after submit).

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
- Optional: “Describe your AI interest”  
- Message  

### Email
info@thebrokerAI.tech  

---

## PAGE 16 — EU AI ACT COMPLIANCE

### Purpose
Explain what the Act requires and how The BrokerAI builds compliance into the
roadmap. Formerly expanded on a dedicated Home "EU Compliance Support" value
block; Home no longer includes one after the Ragtime-Pro rebrand, so this page
is now reached only via the top nav.

### Quote
“Turning AI compliance obligations into a manageable, structured process.”

### Intro Text (below quote, above cards)
Opens with the former hero subheadline ("Regulatory-aware guidance built into every
roadmap — not bolted on at the end"), then explains that the Act's actual impact on
SMEs is manageable and that every roadmap accounts for these requirements from the
outset.

### Four Obligation Cards
1. **Risk Classification**  
2. **Transparency**  
3. **Data Governance**  
4. **Human Oversight**  

No page-ending CTA; the obligation cards are the page's final content.

---

## PAGE 17 — PRIVACY POLICY

### Purpose
Footer/legal page explaining what personal data the site collects and how it's used.

### Content
No quote band. A centered H1 + "Last updated" date, then a single-column list of
sections: Who we are; Information we collect (drawn from the actual Contact form
fields — name, company, email, message, optional phone, optional AI interest — and
noting the site uses no cookies or analytics); How we use your information; Legal
basis for processing; Sharing your information; Data retention; Your rights (GDPR);
Changes to this policy; Contact us (mailto link).

## PAGE 18 — TERMS OF SERVICE

### Purpose
Footer/legal page governing use of the website (a separate signed agreement governs
any actual consulting engagement).

### Content
No quote band. Same layout as Privacy Policy: centered H1 + "Last updated" date, then
sections: Acceptance of these terms; About our services; No professional advice
(the site's content is general information, not legal/financial/regulatory advice);
Vendor referrals (disclaims responsibility for third-party vendors referred to via the
brokerage); Intellectual property; Limitation of liability; Changes to these terms;
Contact us. No governing-law/jurisdiction clause is included — the site owner's
registered entity and jurisdiction weren't available in the authoritative documents,
so this was deliberately left for a lawyer or the site owner to add.

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
  submitter's name, company (optional), email, phone, AI interest, and
  message, asking for a JSON response (`personalizedReply`,
  `replySubject`), auto-detecting and replying in the visitor's own language.
  If the call fails, times out, or the response doesn't parse into valid,
  non-empty JSON, `generateAiReply` returns `null` and the route falls back to
  a fixed acknowledgement text and subject.
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
  `noreply@thebrokerai.tech`) and `MAIL_INFO_ADDRESS` (the "To" on the
  internal notification email and the "Bcc" on every acknowledgement email,
  currently `info@thebrokerai.tech`).
  `MAIL_ACK_BLOCKLIST` (comma-separated addresses that are never
  acknowledged; see §8.5) is also part of this group.

## 8.5 Inbox Polling & Auto-Acknowledgement
- **Purpose:** automatically sends the same AI-generated acknowledgement
  (§8.4) to anyone who emails `info@thebrokerai.tech` directly, not just
  visitors who use the Contact form.
- **API route:** `src/app/api/inbox-poll/route.ts` — a `GET` Route Handler,
  protected by a shared secret: the request must include
  `Authorization: Bearer <INBOX_POLL_SECRET>` or it returns `401`.
  `export const maxDuration = 60`.
- **IMAP polling:** on each invocation, connects via `imapflow` to
  `PURELYMAIL_IMAP_HOST:PURELYMAIL_IMAP_PORT` (Purelymail,
  `imap.purelymail.com:993`) authenticated with `PURELYMAIL_IMAP_USER` /
  `PURELYMAIL_IMAP_PASS` (a separate Purelymail account/password for
  `info@thebrokerai.tech`, distinct from the `noreply@` SMTP credentials in
  §8.4). Opens `INBOX`, searches for unseen messages (capped at 10 per run),
  downloads and parses each with `mailparser`, and immediately marks it
  `\Seen` so a later failure doesn't cause it to be reprocessed forever.
- **Loop/spam guard:** a message is skipped (still marked `\Seen`, but no
  acknowledgement sent) if its sender address is in `MAIL_ACK_BLOCKLIST`
  (comma-separated env var, defaults to the site's own sending addresses —
  `noreply@thebrokerai.tech`, `info@thebrokerai.tech`) or if it carries an
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
  the `gonzaedu61/theBrokerAI` GitHub repository.
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
- **Navbar** (`src/components/Navbar.tsx`) — sticky top navigation; renders the 8 top-level nav items (Home is reached via the logo/brand mark, not a nav item), logo, and mobile menu toggle. Desktop nav shows at the `xl` breakpoint and above; below that it falls back to the hamburger menu. The logo is the `Ragtime-Pro_Logo.png` lockup (icon + wordmark, no separate text label), flip-animated in a 72×149px box sized to its aspect ratio.
- **Footer** (`src/components/Footer.tsx`) — footer navigation (Privacy Policy, Terms of Service, Contact) and copyright line. No LinkedIn link yet — see §2.2.
- **RotatingHeadline** (`src/components/RotatingHeadline.tsx`) — client component cycling through 5 two-line phrases on the Home hero, one every 8 seconds with a cross-fade transition. Starts on a random phrase on each mount (not always the first) so repeat visits and refreshes don't always open on the same line.
- **RoadmapVideoButton** (`src/components/RoadmapVideoButton.tsx`) — reusable video-icon trigger; renders a small icon (optionally with a text label) that opens a centered modal video player animating in/out from the icon's screen position. Takes a `src` (defaults to the AI Roadmap Guide video), an optional `lowBandwidthSrc` for connection-aware source switching, and a `blueHoverIcon` toggle (icon swaps to an electric-blue variant on hover; disabled on Home and Start Your Journey, where a size-only hover effect is used instead). Used on: Home, Start Your Journey (two instances), The AI Dilemma, Core Barriers, Coaching, About, AI Solution Categories, Our Methodology, Engagement Model, and every Solution Class detail page (via `SolutionDetail`).
- **VertexTriadNav** (`src/components/VertexTriadNav.tsx`) — small Driving-Triad diagram used in the left-side nav slot on the Need/Opportunity/Readiness pages; highlights the current vertex and links to the other two.
- **SolutionDetail** (`src/components/SolutionDetail.tsx`) — shared template rendering a single Solution Class's Quote, Overview, sidebar of the other four categories, Value/Examples/Readiness Requirements/Roadmap Fit cards, and a roadmap CTA; used by the dynamic `/solutions/[slug]` route. See Page 6 for its 3-column grid layout.
- **ExternalLinkIcon** (`src/components/ExternalLinkIcon.tsx`) — small inline SVG "leads elsewhere" arrow icon (hand-drawn, no external asset). Used on every card that is itself a link, positioned bottom-right; see Section 10.3.

## 10.2 Content Data Sources
- `src/lib/solutions.ts` — single source of truth for the 5 Solution Class entries (including each solution's `quote`), consumed by both the `/solutions` overview cards and the `/solutions/[slug]` detail pages.

## 10.3 Shared Visual Patterns
- **Navy pull-quote bar** — a slim `bg-navy py-8` band holding one italic, centered quote (`text-2xl font-medium italic text-white`), placed directly beneath each page's H1 hero. Used on every page except Home. Quotes are sourced verbatim from the AI Roadmap Guide PDF (Section 12 authoritative source), one per page — see each page's "Quote" entry in Section 3.
- **Card color scheme** — two deliberately inverted schemes depending on page:
  - *Home*: white cards (`bg-white`) sit on a gray section (`bg-light-grey`).
  - *Every other page*: gray cards (`bg-light-grey`) sit directly on the white page background — no wrapping gray section. This applies to all content card grids (About, AI Dilemma, Core Barriers, Coaching, Methodology, Solution Class cards and detail-page cards, Engagement Model's steps and Value-Centered Layers cards, EU AI Act Compliance).
- **Linked-card indicator** — every card that is itself a `<Link>` (Home value blocks, Solution Class cards) shows the `ExternalLinkIcon` component pinned `absolute bottom-4 right-4` (card given `relative` + extra `pb-10`), at `text-charcoal/40` resting and `text-electric-blue` on hover, in place of any "Learn more →" text. Purely informational cards never show this icon.
- **Card hover state (linked cards only)** — `border border-transparent` at rest, transitioning to `hover:-translate-y-1 hover:border-electric-blue hover:shadow-md`. Applied only to cards that are actual links (Home value blocks, Solution Class cards); purely informational card grids do not use this pattern.
- **Intro text + video icon** — most content pages place a small `RoadmapVideoButton` icon at the top-left of the page's intro paragraph (`iconClassName="h-9 w-auto"`, wrapped in a `shrink-0` container to prevent flex-shrink distortion), opening a page-specific explainer video in a modal. See each page's "Intro Text" section above for its video file.
- **Flanking side CTAs** — on pages with a centered `max-w-4xl` (or `max-w-3xl`) content column and side elements, the side elements sit in `calc(50% - 26.5rem)` gutters, flanking the centered column without narrowing it. Three implementations, in increasing order of position stability: Value-Centered Layers uses `lg:absolute lg:inset-y-0` with `items-center` (vertically centered against the whole block — shifts if content length varies). Solution Class detail pages (`SolutionDetail`) use an explicit `lg:grid` with the intro text pinned to a fixed height (`lg:h-72 lg:overflow-hidden`) in row 1, and the sidebar nav / roadmap CTA placed in row 2 alongside the Value/Examples/Readiness/Roadmap Fit cards, with `lg:items-start` — their Y-start is fixed, but they're still grid siblings of the cards row. Need/Opportunity/Readiness vertex pages go one step further: the flanking `VertexTriadNav` and roadmap CTA are placed in the *same row* as the fixed-height (`lg:h-56`) intro text (row 1), not the cards row (row 2) — fully decoupling their position from the Four/Three Cards grid below, which varies in row count between vertex pages.
- **Overlay-link cards with a nested link** — Our Methodology's three pillar cards use a `<div>` with an absolutely-positioned full-card `<Link>` underneath (`z-0`, so clicking anywhere still navigates to the pillar page) and `pointer-events-none` on the title (`z-10`) so clicks on it still reach that overlay link. This exists because the Opportunity card's body text contains its own nested `<Link>` (the phrase "AI Solution" → `/solutions`), rendered above the overlay so it stays independently clickable — a plain wrapping `<Link>` can't contain another `<Link>`.

---

# End of Specification
