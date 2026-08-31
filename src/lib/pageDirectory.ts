import { SOLUTIONS } from "@/lib/solutions";

// Single source of truth for the site's public origin, used by both the
// chat prompt and the contact/email reply prompt to build real page URLs.
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ragnify.pro";

export interface PageContext {
  title: string;
  description: string;
}

// Short, LLM-facing descriptions of each page's purpose - deliberately not
// reused from next/metadata (some pages are Client Components and can't
// export metadata at all; keeping this separate also lets these stay tuned
// for grounding chat answers rather than SEO). Solution pages are derived
// from SOLUTIONS below instead of duplicated here.
const STATIC_PAGES: Record<string, PageContext> = {
  "/": {
    title: "Home",
    description:
      "RAGnify's homepage: a safe, structured, effective approach to AI-driven modernization for legacy software products, introducing the Modernization Agent, the Product Modernization Triad, and the AI Upgrade Modules.",
  },
  "/ai-dilemma": {
    title: "The Modernization Dilemma",
    description:
      "The product still works but the market has moved - why legacy software vendors hesitate to modernize, and what actually gets in the way.",
  },
  "/ai-dilemma/barriers": {
    title: "Core Barriers to Modernization",
    description:
      "The four barriers holding legacy software vendors back from AI modernization: cost perception, skills gap, organizational resistance, and compliance & ethics.",
  },
  "/ai-dilemma/coaching": {
    title: "Coaching: The AI-Augmented Barrier Breaker",
    description:
      "How AI-augmented coaching, powered by the Modernization Agent, demystifies modernization, bridges the skills gap, reduces resistance, and ensures EU AI Act compliance.",
  },
  "/solutions": {
    title: "AI Solution Categories",
    description:
      "Overview of the five AI Solution Categories for legacy software modernization: Personal Productivity, Intelligent Workflows, RAG Solutions, Reasoning Agents, and Custom AI Models.",
  },
  "/modernization-agent": {
    title: "The Modernization Agent",
    description:
      "RAGnify's proprietary AI system - the internal intelligence engine behind every modernization engagement.",
  },
  "/methodology": {
    title: "Our Methodology",
    description:
      "The Product Modernization Triad: Boost Point, Opportunity, and Readiness - the three vertices that shape every AI-driven legacy modernization roadmap.",
  },
  "/methodology/boost-point": {
    title: "Boost Point",
    description:
      "The Boost Point vertex of the Product Modernization Triad: the modernization hotspot where AI can create the highest product value with minimal disruption.",
  },
  "/methodology/opportunity": {
    title: "Opportunity",
    description:
      "The Opportunity vertex of the Product Modernization Triad: matching each Boost Point to the best-fit AI Upgrade Module.",
  },
  "/methodology/readiness": {
    title: "Readiness",
    description:
      "The Readiness vertex of the Product Modernization Triad: how prepared the product is to safely integrate the selected AI Upgrade Module.",
  },
  "/methodology/process": {
    title: "The Modernization Journey",
    description:
      "The eight-step process behind every RAGnify modernization engagement, from product discovery to guided implementation.",
  },
  "/about": {
    title: "About RAGnify",
    description:
      "RAGnify is a modernization partner for legacy software vendors: an AI-augmented Modernization Agent, the Product Modernization Triad, expert consultants, and AI Upgrade Modules.",
  },
  "/eu-ai-act-compliance": {
    title: "EU AI Act Compliance",
    description:
      "How the EU AI Act's four risk tiers, transparency, data governance, human oversight, and lifecycle-monitoring obligations apply to AI-modernized legacy software, and how RAGnify builds compliance into every roadmap.",
  },
  "/start": {
    title: "Start Your Journey",
    description:
      "Engagement with RAGnify begins with a conversation, not a proposal: three phases from a free introductory consultation to an ongoing modernization partnership.",
  },
  "/contact": {
    title: "Contact",
    description: "The contact page: a form to reach RAGnify, or to request an introductory call.",
  },
};

export function getPageContext(pathname: string | null | undefined): PageContext | null {
  if (!pathname) return null;

  const staticMatch = STATIC_PAGES[pathname];
  if (staticMatch) return staticMatch;

  const solutionMatch = pathname.match(/^\/solutions\/([^/]+)\/?$/);
  if (solutionMatch) {
    const solution = SOLUTIONS.find((s) => s.slug === solutionMatch[1]);
    if (solution) {
      return { title: solution.title, description: solution.definition };
    }
  }

  return null;
}

export interface PageDirectoryEntry extends PageContext {
  path: string;
}

// Every known page as {path, title, description} - used for link-matching
// in the RAG-powered email reply (src/lib/aiReply.ts), separately from the
// single-page lookup above used for chat page-awareness.
export function getAllPages(): PageDirectoryEntry[] {
  const staticEntries = Object.entries(STATIC_PAGES).map(([path, context]) => ({
    path,
    ...context,
  }));
  const solutionEntries = SOLUTIONS.map((solution) => ({
    path: `/solutions/${solution.slug}`,
    title: solution.title,
    description: solution.definition,
  }));
  return [...staticEntries, ...solutionEntries];
}
