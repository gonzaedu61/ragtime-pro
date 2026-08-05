# CLAUDE.md — Eduardo Consulting Website

This document defines the deterministic rules Claude Code must follow when working inside this project.
Claude must treat these rules as authoritative and apply them to all tasks, plans, routines, and file edits.

---

## 1. Project Overview
- Purpose: Build and maintain Eduardo’s consulting website focused on AI‑Consulting and AI‑Solutions.
- Stack: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS.
- Deployment: Vercel.
- Package manager: **npm only**.

---

## 2. Deterministic npm Rules

### 2.1 Allowed Package Manager
- Use **npm** exclusively.
- Never use yarn, pnpm, bun, or any alternative.

### 2.2 Installation Behavior
- Claude must **never install packages automatically**.
- Claude must **always show the exact npm commands** before running them.
- Claude must **wait for explicit approval** before executing any installation.

### 2.3 Dependency Management
- Modify `package.json` deterministically.
- List all added packages explicitly.
- Avoid version ranges (`^`, `~`). Use **exact versions** when possible.
- Never remove dependencies unless explicitly instructed.

### 2.4 Allowed Commands
Claude may run only:
- `npm install`
- `npm install <package>@<version>`
- `npm uninstall <package>`
- `npm run dev`
- `npm run build`
- `npm run lint`

---

## 3. Deterministic Task Execution Rules
Claude must always:
- Plan the steps before executing.
- Show diffs for every file change.
- Wait for explicit approval.
- Execute changes exactly as shown.
- Summarize results clearly.
- Warn if a request contradicts CLAUDE.md or authoritative documents.

Claude must never:
- Perform broad refactors without instruction.
- Modify multiple unrelated files unless requested.
- Invent new features or pages.

---

## 4. Code Style Rules
- Use TypeScript everywhere.
- Use functional components.
- Use server components by default unless interactivity is required.
- Use Tailwind utility classes only.
- No CSS modules or styled‑components unless explicitly requested.
- Keep components small, composable, and deterministic.

---

## 5. File & Folder Structure Rules
Claude must maintain the following structure:

src/app/
src/components/
src/lib/
public/
styles/


- Claude must update imports when files move.
- Claude must avoid duplicate components or pages.
- Claude must warn if a requested change breaks structure.

---

## 6. Initial Project Scaffolding Rules
Claude must generate:
- package.json (exact versions)
- tsconfig.json
- next.config.js
- Tailwind config files
- App Router structure
- Base layout and homepage
- Public assets folder

Claude must show diffs before creating or modifying any scaffolding file.

---

## 7. Tailwind CSS Rules
Claude must:
- Generate and maintain `tailwind.config.js`
- Generate and maintain `postcss.config.js`
- Maintain `globals.css` with Tailwind base, components, utilities
- Ensure correct integration with Next.js App Router
- Never introduce alternative styling systems unless instructed

---

## 8. Content & Copywriting Rules
- Tone: professional, structured, benefit‑driven.
- Emphasize clarity, safety, readiness, and AI‑consulting expertise.
- Avoid hype or generic consulting clichés.
- Use authoritative documents as content sources.
- Claude must confirm the origin of any quote or content when asked.

---

## 9. SEO Rules
Claude must maintain:
- Page titles
- Meta descriptions
- OG images
- Keyword alignment (AI adoption, AI roadmap, EU AI Act, RAG, workflow automation, reasoning agents, custom models)

Claude must never:
- Add SEO metadata without instruction
- Invent keywords not aligned with authoritative documents

---

## 10. Deployment Rules

### 10.1 Local Development
- All development happens locally.
- Use `npm run dev` for preview.
- Never deploy during development.
- Never create CI/CD pipelines unless requested.

### 10.2 Production Deployment
- Deploy only when explicitly instructed.
- Preferred provider: Vercel.
- Deployment command: `vercel --prod`.
- Prepare production builds using `npm run build`.
- Never deploy automatically.

### 10.3 Safety
- Never expose environment variables.
- Never create `.env` files with real secrets.
- Warn if a deployment request is ambiguous.

---

## 11. Versioning Rules
- Treat project as pre‑release until v1.0.
- Never create production builds unless requested.
- Tag releases using semantic versioning (v1.0.0, v1.1.0, etc.).
- Encourage committing before major changes.

---

## 12. Authoritative Specification Sources

Claude must treat the following documents as canonical:

1. AI Roadmap Guide ("./The BrokerAI - AI Roadmap Guide.pdf")
2. The BrokerAI Website Specification Document ("./TheBrokerAI - Website Initial Spec.pdf")
3. TheBrokerAI Presentation Deck ("./theBrokerAI.pptx")
4. The BrokerAI Logo / Microchip Graphic ("./logo.png")

### 12.1 Usage Rules
- Claude must reference these documents before generating pages.
- Claude must extract content, quotes, and structure directly from them.
- Claude must summarize, trim, and adjust the content as required to properly fit a web page size without missing meaning or semantics
- Claude must follow the sitemap and UX rules exactly.
- Claude must maintain brand personality and messaging.
- Claude must warn if user instructions contradict the documents.

### 12.2 Priority Order
1. Website Specification Document  
2. AI Roadmap Guide  
3. PPT Deck  
4. CLAUDE.md  

---

## 13. Website Specification Document (Managed Artifact)

Claude must treat the Website Specification Document as a governed, versioned,
and deterministic artifact of this project.

### 13.1 File Location
The specification file is located at:

`/docs/website-specification.md`

Claude must always read and update this file when required.

### 13.2 Authority
This document is the canonical narrative description of the website and must
always reflect the current state of:
- Codebase
- Architecture
- Components
- Pages
- Sitemap
- Visual identity
- UX rules
- SEO rules
- Conversion strategy
- Technical stack
- Compliance requirements

### 13.3 Update Trigger
Claude must update this document whenever any change occurs that matches the
rules defined in Section 20 (Website Specification Regeneration Policy).

### 13.4 Update Workflow
Claude must:
1. Load the current `/docs/website-specification.md`
2. Load the current codebase and CLAUDE.md
3. Generate a deterministic diff
4. Wait for explicit approval
5. Apply changes exactly as shown
6. Summarize the update

### 13.5 Stability Rules
- Claude must never rewrite the entire document unless explicitly instructed.
- Claude must never invent features, pages, or components.
- Claude must never remove sections without explicit instruction.
- Claude must maintain consistent formatting and section ordering.
- Claude must treat updates to this document like code changes.

### 13.6 Priority
If a conflict arises:
1. CLAUDE.md rules take priority.
2. Then authoritative documents (Section 12).
3. Then the Website Specification Document.

---

## 14. Component Library Governance
Claude must:
- Maintain a deterministic component library.
- Document each component in the Website Specification Document.
- Update component documentation when components change.
- Warn if a component is duplicated or inconsistent.

---

## 15. Sitemap Governance
Claude must:
- Maintain a deterministic sitemap.
- Update sitemap documentation whenever pages are added or removed.
- Warn if a requested page contradicts the sitemap.

---

## 16. Interaction & Animation Rules
Claude must:
- Use minimal, purposeful animations.
- Avoid heavy libraries unless explicitly requested.
- Ensure accessibility and performance.
- Document interactions in the Website Specification Document.

---

## 17. Accessibility Rules
Claude must:
- Follow WCAG AA accessibility guidelines.
- Ensure semantic HTML.
- Ensure keyboard navigation works.
- Warn if a requested change reduces accessibility.

---

## 18. Performance Rules
Claude must:
- Optimize images and SVGs.
- Maintain Lighthouse score > 90.
- Avoid unnecessary client components.
- Warn if a change harms performance.

---

## 19. CLAUDE.md Evolution Policy
Claude must update CLAUDE.md only when explicitly instructed, using a diff‑based workflow, with full user approval, and must maintain structure, clarity, and stability.

Allowed updates include:
- New rules
- Updated sitemap
- New authoritative documents
- Revised deployment strategy
- Updated SEO rules
- New design system elements
- New templates
- Removal of deprecated rules

Claude must never modify CLAUDE.md automatically.

---

## 20. Website Specification Regeneration Policy
Claude must regenerate the Website Specification Document whenever structural, architectural, design, or content changes occur.

Claude must:
1. Load the current specification
2. Load the codebase and CLAUDE.md
3. Generate a deterministic diff
4. Wait for approval
5. Apply changes exactly
6. Summarize clearly

Claude must ensure:
- The specification always matches the codebase
- No speculative features are added
- No undocumented features remain
- All changes are traceable and diff‑based

Claude must treat specification updates like code changes.
