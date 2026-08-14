# RAG Answer Quality Evaluation — 2026-08-14

10 in-scope questions + 5 out-of-scope questions run against the live `POST /api/rag/answer` endpoint, real Azure OpenAI calls, real R2 sessions. This file preserves the raw results before the corresponding test session objects are deleted from R2.

Each test used its own fresh session (no shared conversation history between questions).

---

## In-Scope Questions

### 1. What is the Product Modernization Triad?

The Product Modernization Triad is Ragtime-Pro's strategic framework for AI-driven legacy modernization. It consists of three interlocking "vertices":

- Boost Point – where AI can deliver the biggest value with minimal disruption
- Opportunity – which AI Upgrade Module (from productivity features to custom models) best fits that boost point
- Readiness – how prepared the product is (in architecture, data, team skills, compliance) to integrate the module safely

Our Modernization Agent continuously adapts the Triad to your product's code, workflows, usage and regulations, and our consultants execute it. The result is a roadmap that's always safe, compliant and value-driven.

**Sources:** ragtime-pro-modernizing-legacy-software-with-ai (5), website-copy-export (4), syanthesia-script (1)

---

### 2. What is a Boost Point?

A Boost Point is the exact spot in your product where AI can add the most value with the least disruption. Our Modernization Agent analyzes your source code, documentation, workflows, customer-usage data, competitive gaps and industry constraints to pinpoint these hotspots. Typical examples include a repetitive workflow ready for automation, a static module that could gain contextual intelligence, a decision process ripe for AI-driven augmentation or a dated user interface that an AI layer could streamline. By anchoring modernization on Boost Points, every AI Upgrade Module we deliver targets a real, high-value opportunity rather than chasing the latest shiny technology.

**Sources:** ragtime-pro-modernizing-legacy-software-with-ai (4), syanthesia-script (3), website-copy-export (3)

---

### 3. What are the four risk tiers under the EU AI Act?

The EU AI Act sorts AI systems into four risk tiers:
- Unacceptable risk
- High-risk
- Limited-risk
- Minimal-risk

**Sources:** website-copy-export (4), syanthesia-script (3), ragtime-pro-modernizing-legacy-software-with-ai (3)

---

### 4. What is the Modernization Agent and what does it do?

The Modernization Agent is Ragtime-Pro's proprietary AI engine—the "thinking" core of every engagement. It ingests your product's entire context (source code in any language or architecture, user manuals, technical specs, workflows, business rules, industry and regulatory constraints, competitive landscape) and then:

- Automatically maps your full architecture, data flows and dependencies
- Detects "Boost Points," the high-value spots where AI adds the most impact with least disruption
- Aligns each Boost Point to the right AI Upgrade Module (or generates a custom one if needed)
- Sequences a safe, step-by-step modernization plan
- Embeds risk, compliance (including EU AI Act) and data-governance checks at every stage
- Produces a detailed blueprint—and even starter code—for each module

It doesn't replace your team's product knowledge or our consultants' expertise; it accelerates and structures the entire modernization roadmap.

**Sources:** ragtime-pro-modernizing-legacy-software-with-ai (4), website-copy-export (4), syanthesia-script (2)

---

### 5. What are the five AI Solution Categories Ragtime-Pro offers?

The five AI Solution Categories are:

1. Personal Productivity Enhancements
2. Intelligent Workflow Automations
3. RAG Solutions (Retrieval-Augmented Generation)
4. Reasoning Agents
5. Custom AI Models

**Sources:** ragtime-pro-modernizing-legacy-software-with-ai (5), website-copy-export (4), syanthesia-script (1)

---

### 6. What's the difference between Reasoning Agents and Intelligent Workflows?

Intelligent Workflows and Reasoning Agents both use AI to modernize legacy products, but they sit at different levels of sophistication and deliver different kinds of value:

**1. Intelligent Workflows (Modernization Category 2)**
- Embed AI into existing processes to remove repetitive manual steps.
- Automate predictable, rule-based tasks (for example invoice processing, lead routing or document classification).
- Focus on straight-through efficiency gains—fewer handoffs, lower error rates, faster throughput.
- Require well-defined processes, consistent data inputs and stable integration points.

**2. Reasoning Agents (Modernization Category 4)**
- Go beyond automation and retrieval: they interpret, evaluate options, recommend actions and—even if needed—execute multi-step decisions.
- Tackle complex, conditional workflows that demand domain expertise and compliance (for example configuration assistants, diagnostic bots or risk-aware recommendation engines).
- Need clear decision rules, audit trails, deterministic APIs and sandboxed testing to ensure safety and predictability.
- Transform the product into an intelligent partner—guiding users through complexity rather than just speeding up existing steps.

Put simply, Intelligent Workflows lift the burden of manual operations; Reasoning Agents bring genuine decision-making intelligence into your product. If you'd like to explore how each fits into your modernization roadmap, let us know or book an introductory call.

**Sources:** ragtime-pro-modernizing-legacy-software-with-ai (6), syanthesia-script (2), website-copy-export (2)

---

### 7. What are the eight steps in the Modernization Journey?

Here are the eight steps of Ragtime-Pro's Modernization Journey:

1. **Product Discovery & Context Mapping** — We map your architecture, domain, customers, workflows and constraints into a single Product Context Map.
2. **Modernization Opportunity Analysis** — The Modernization Agent surfaces friction points, bottlenecks and automation opportunities.
3. **AI Solution Category Alignment** — Each opportunity is mapped to one of our five AI solution categories based on your product's maturity.
4. **Standard Modules Mapping** — We first look for a fit in our library of pre-built AI Upgrade Modules; if there's a gap, the Agent generates a custom one.
5. **Modernization Sequencing** — We define what to build first, what follows next, and what preparation is needed at each stage.
6. **Risk & Compliance Assessment** — We check EU AI Act implications, data governance, human oversight and other compliance requirements before moving on.
7. **Modernization Blueprint Creation** — You get a detailed roadmap with goals, sequence, integration paths, expected ROI and risk mitigation strategies.
8. **Guided Implementation** — We partner with your team through safe rollout, customer-aware deployment, continuous monitoring and iterative refinement.

**Sources:** syanthesia-script (5), ragtime-pro-modernizing-legacy-software-with-ai (4), website-copy-export (1)

---

### 8. How does Ragtime-Pro's coaching approach reduce resistance to modernization?

Ragtime-Pro's coaching tackles resistance head-on by combining human guidance with AI-driven clarity and evidence. Our Modernization Agent first analyzes your codebase and maps out risk-controlled, step-by-step upgrade plans. We then work side-by-side with your team, explaining each integration point in plain language, respecting existing architecture and tribal knowledge. Early, low-risk "wins" demonstrate real value, while built-in compliance checks under the EU AI Act eliminate regulatory fear. The result is a transparent, predictable evolution rather than a disruptive leap—turning skepticism into confidence.

**Sources:** ragtime-pro-modernizing-legacy-software-with-ai (6), website-copy-export (4)

---

### 9. What is RAG and how does it help legacy software?

RAG stands for Retrieval-Augmented Generation. It's an AI technique that taps into a product's existing knowledge assets—documentation, domain rules, support tickets, logs—to retrieve the right information and then generate natural-language answers or guidance in context.

How it helps legacy software:
- Embeds a "knowledge assistant" into the UI so users get instant, contextual answers instead of hunting through manuals or opening support tickets
- Powers troubleshooting copilots, onboarding guides, domain-specific Q&A and in-workflow help
- Reduces support load, speeds up onboarding, cuts errors and manual handoffs
- Unlocks hidden value in decades of documentation and tribal knowledge
- Integrates safely and incrementally—no full rewrite or deep refactoring of core logic required
- Lays a foundation for further AI upgrades (reasoning agents, custom models) and helps your product feel modern without disrupting existing workflows

**Sources:** ragtime-pro-modernizing-legacy-software-with-ai (6), syanthesia-script (2), website-copy-export (2)

---

### 10. How do I get started working with Ragtime-Pro?

Getting started is easy and commitment-free. It begins with our First Talk—a short, no-pressure conversation where we learn about your product, goals, and constraints and walk you through our Modernization Agent, the Product Modernization Triad, and AI Upgrade Modules.

After that, we run a Modernization Assessment: an Agent-supported deep dive that maps your architecture, identifies Boost Points, aligns Opportunity and Readiness, and flags EU AI Act compliance considerations. You receive a detailed Assessment Report that becomes the foundation of your roadmap.

Once you validate the plan, we partner with you to deliver AI Upgrade Modules, integrate them incrementally, and provide ongoing monitoring and governance.

To start, simply request your free introductory consultation via our website's contact form or email us directly. We'll schedule that first talk at your convenience.

**Sources:** syanthesia-script (4), website-copy-export (4), ragtime-pro-modernizing-legacy-software-with-ai (2)

---

### 11. What is this site about?

This site introduces Ragtime-Pro, a modernization partner for European software vendors looking to bring legacy products into the AI era. You'll find:

- An overview of our Modernization Agent—our proprietary AI engine that analyzes your source code, documentation, workflows and usage data to generate practical modernization plans.
- Our Product Modernization Triad framework—how we identify the highest-value "Boost Points," assess Opportunities and gauge Readiness to deliver targeted AI Upgrade Modules without disruptive rewrites.
- Descriptions of the types of AI upgrades we build—RAG-style assistants, intelligent workflows, reasoning agents and more—plus guidance on navigating EU AI Act compliance.
- Our methodology and consulting layer, which combine AI-driven insights with hands-on expert support to execute safely and incrementally.

Everything on the site is for general informational purposes; if you'd like a tailored recommendation or to explore a formal engagement, please book an introductory call or submit an inquiry.

**Sources:** website-copy-export (5), syanthesia-script (4)

---

## Out-of-Scope Questions

### 1. What is the weather like today?

I'm sorry, I don't have weather information. For today's forecast please check your preferred weather service or app.

---

### 2. Can you write me a Python script to sort a list?

I'm sorry, but I don't have guidance on general Python scripting in this context. If you have questions about AI-driven legacy product modernization or our services, please fill out our contact form or book an introductory call so we can help.

---

### 3. Who won the 2024 US presidential election?

I'm sorry, I don't have information on the outcome of the 2024 US presidential election. If you have questions about Ragtime-Pro's modernization services, please use our contact form or book an introductory call.

---

### 4. What's Ragtime-Pro's stock price?

I'm sorry, I don't have any information on Ragtime-Pro's stock price. Please reach out via our contact form or book an introductory call, and we'll be happy to help.

---

### 5. Can you help me file my taxes?

I'm sorry, but I'm not able to advise on personal tax filings. If you need help filing your taxes, I'd recommend reaching out to a qualified tax professional or accountant. If you have questions about Ragtime-Pro's legacy-software modernization services, please let me know or use our contact form to book an introductory call.

---

## Test Session IDs (for R2 cleanup once reviewed)

```
cd9b6f55-244a-4033-b0ee-1d7adf2036f2
42a3cf31-11a0-484d-8417-8fd141f4cc56
2c64eeb4-9807-48f7-bea7-069dd81d145a
1cd3264c-0738-4f44-8f8e-a2bc79e39f29
fadd3dfc-531f-4f9b-a59f-f227b31b6d18
db680dba-011c-4d2a-92f4-c96555b03de2
1c1dd51c-2f79-4de4-8c48-553f4c6cb218
3325be5b-ae92-4829-b679-742ab74bb43c
8c1e70ac-6165-4754-887e-da5bd918b4f0
24d72b6b-a22b-40e5-b730-43034c445162
f10f3fdb-ea13-4197-a103-fd5bb7388e62
62eb4840-7721-468d-a0a3-e1924eb5ecc9
e5f31eac-1507-42a1-90ab-167749294eb0
6adcaf19-7ab8-4aa7-a2d8-591bb7f3c92e
eb767c33-8ed3-4b2a-96c4-44bf80cedd1e
aa0309eb-596f-437a-93bd-7ee2caba5849
```

All 16 test session objects listed above have been deleted from R2 as of 2026-08-14 — this list is kept for reference only.

---

## CTA Behavior Test — 2026-08-14 (after prompt adjustment)

Verifies the two new rules added to `answerPrompt.ts`: (1) only include a call-to-action when the question itself is about next steps/pricing/timelines/implementation/engagement, and (2) force a CTA every 3rd consecutive question in a session regardless of topic. All four questions asked in a single continuous session (same cookie/history).

**Session ID:** `f0b586a5-a151-414d-91f3-879fa653fbf4` (deleted from R2 as of 2026-08-14, after review)

### Turn 1 (definitional — expect no CTA): "What is a Boost Point?"

A Boost Point is the exact spot in your existing product where adding AI will create the most value with the least disruption to what's already there. Our Modernization Agent uncovers these "hotspots" by analyzing your source code, documentation, workflows, customer usage patterns, integration landscape, competitive gaps and pain points. Examples include a repetitive workflow ready for automation, a static module that can gain contextual intelligence, a decision process that can be augmented, or an outdated UI that can be made smarter. By anchoring modernization on Boost Points, every AI Upgrade Module we introduce targets a real, high-value opportunity rather than chasing the latest shiny technology.

**Result:** ✅ No CTA, as expected.

---

### Turn 2 (definitional — expect no CTA): "What is Readiness in the Triad?"

Readiness is the third vertex of the Product Modernization Triad. It measures how prepared your product really is to absorb a new AI Upgrade Module without destabilizing what already works. In practice, Readiness covers:

- Architecture & APIs – can your existing architecture and integration points support the new AI capability?
- Data & Documentation – is your data quality high enough and documentation clear enough for the module to learn from and operate on reliably?
- Team & Governance – do you have the skills, clear ownership, and governance processes in place to build, deploy, and maintain the module?
- Industry & Compliance Constraints – are there regulatory, security or compliance requirements that must be met before going live?

Readiness acts as a guardrail: if it's high, you can execute the modernization step immediately; if it's low, you first shore up architecture, data, workflows or governance before introducing the AI capability.

**Result:** ✅ No CTA, as expected.

---

### Turn 3 (definitional, but turn 3 → periodic trigger — expect forced CTA): "What is Opportunity in the Triad?"

Opportunity is the second vertex of the Product Modernization Triad. It determines which AI Upgrade Module category best fits a given Boost Point by evaluating:

- Boost Point Fit – how precisely the AI capability addresses the identified hotspot
- Technology Maturity – how proven and production-ready the underlying AI technology is
- Integration Challenge – how much effort it takes to embed the module without destabilizing your architecture

This ensures you pick the AI solution that delivers the most real value for your product. To explore this in the context of your software, please use our contact form or book an introductory call.

**Result:** ✅ CTA appended by the periodic (every-3rd-turn) rule, even though the question itself is purely definitional.

---

### Turn 4 (topical trigger — "how long" implies timeline/implementation — expect CTA): "How long does implementation take?"

Implementation timelines vary based on your product's complexity, the number and type of Boost Points we target, and your Readiness level (architecture, data, governance, compliance, etc.). We follow an eight-step Modernization Journey—from discovery through guided rollout—but we don't have one-size-fits-all durations. For a tailored estimate based on your specific context, please use our contact form or book an introductory call.

**Result:** ✅ CTA appended by the topical rule (turn 4 isn't a multiple of 3, so this confirms the topic-based trigger works independently of the periodic one). Also notable: it honestly declined to invent a specific timeline rather than fabricating one.

**Summary: all 4 expected outcomes matched.**
