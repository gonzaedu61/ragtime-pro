export interface SolutionClass {
  slug: string;
  title: string;
  teaser: string;
  definition: string;
  overview: string;
  icon?: string;
  iconHover?: string;
  video?: string;
  quote: string;
  smeValue: string;
  examples: string[];
  readinessRequirements: string;
  roadmapFit: string;
}

export const SOLUTIONS: SolutionClass[] = [
  {
    slug: "personal-productivity",
    title: "Personal Productivity",
    teaser:
      "Small improvements that create immediate value — quick wins that boost individual output without touching the architecture.",
    definition:
      "Small, safe, high-impact AI enhancements that improve user productivity without destabilizing the product.",
    overview:
      "Modernizing a legacy product does not necessarily begin with deep architectural change — it begins with small, safe, high-impact enhancements that improve user productivity without destabilizing what already works. Legacy products often carry workflows designed years ago, before modern UX and AI assistance existed, so users still perform repetitive tasks, search through long lists, and navigate complex forms by hand. These enhancements are the lowest-risk modernization category, yet they deliver immediate value: they prove modernization is possible, reduce internal resistance, and build the trust that carries a product into deeper modernization layers.",
    icon: "/personal_productivity.svg",
    iconHover: "/personal_productivity_blue.svg",
    video: "/Personal_Productivity.mp4",
    quote: "Small improvements that create immediate value.",
    smeValue:
      "Boosts legacy software usability by reducing friction, accelerating daily tasks, and helping users work faster with simplified interactions.",
    examples: [
      "Smart suggestions",
      "Guided inputs",
      "Instant summaries",
      "Contextual assistance",
    ],
    readinessRequirements:
      "Clear user roles, accessible screens, basic workflow documentation, and stable touchpoints so AI can streamline common tasks without deep changes.",
    roadmapFit:
      "Ideal early modernization win that immediately improves user satisfaction and demonstrates fast, low-risk AI value.",
  },
  {
    slug: "workflow-automation",
    title: "Intelligent Workflows",
    teaser:
      "AI that removes friction from everyday operations — automating multi-step processes for real operational efficiency.",
    definition:
      "AI-driven intelligence woven into the product's operational backbone, removing friction and accelerating user workflows.",
    overview:
      "AI embedded directly into your product's existing legacy workflows to remove repetitive manual steps. Traditional automation handles predictable, rule-based tasks; AI-enhanced automation adds reasoning, classification, and decision-making at key points, enhancing workflows that already work rather than replacing them. By automating tasks like invoice processing, lead routing, scheduling, and document classification, it frees staff time from repetitive work and reduces error rates across day-to-day operations.",
    icon: "/intelligent_workflows.svg",
    iconHover: "/intelligent_workflows_blue.svg",
    video: "/Intelligent_Workflows.mp4",
    quote: "Automations, … yes. — But smarter ones.",
    smeValue:
      "Transforms rigid legacy processes into smooth, automated flows that reduce delays, errors, and manual handoffs across departments.",
    examples: [
      "Automated approvals",
      "Proactive notifications",
      "Guided steps",
      "Cross-module coordination",
    ],
    readinessRequirements:
      "Defined processes, consistent data inputs, and stable integration points to safely automate around existing legacy logic.",
    roadmapFit:
      "Strong mid-stage modernization layer that enhances operations while preserving legacy system stability.",
  },
  {
    slug: "rag-solutions",
    title: "RAG Solutions",
    teaser:
      "AI that operationalizes your product's knowledge — turning documentation into a queryable assistant that leverages what you already know.",
    definition:
      "AI that turns your product's documentation, historical data, and domain expertise into a living, in-product knowledge assistant.",
    overview:
      "RAG represents a pivotal moment in any product's modernization journey — the point where it stops being a static tool and starts behaving like an intelligent assistant, capable of understanding context and retrieving relevant knowledge. Legacy products often sit on extensive documentation, domain-specific rules, and tribal knowledge held by long-time engineers — valuable, but inaccessible. Users must search manually, ask colleagues, or rely on support teams. RAG solves this by embedding that knowledge directly into the product, so users no longer search for answers — the product provides them. For many vendors, this is the single most transformative modernization step.",
    icon: "/RAG.svg",
    iconHover: "/RAG_blue.svg",
    video: "/RAG_Solutions.mp4",
    quote: "Users no longer search for answers — the product provides them.",
    smeValue:
      "Adds a modern knowledge layer to legacy software, enabling users to instantly find accurate answers from documents and ERP data.",
    examples: [
      "Searchable manuals",
      "Policy lookup",
      "Contextual help",
      "Guided troubleshooting",
    ],
    readinessRequirements:
      "Organized documents, metadata structure, secure access to information sources, and clear ownership of knowledge assets.",
    roadmapFit:
      "Foundational capability that improves usability, reduces dependency on expert users, and supports all future AI initiatives.",
  },
  {
    slug: "reasoning-agents",
    title: "Reasoning Agents",
    teaser:
      "AI that guides users through complex decisions — real-time intelligence for multi-step choices as they happen.",
    definition:
      "AI that interprets, evaluates, and guides users through complex, multi-step decisions — not just retrieving information, but applying it.",
    overview:
      "As products evolve through productivity enhancements, workflow automation, and RAG-based knowledge assistants, they reach a critical modernization milestone: the ability to reason. Reasoning Agents interpret, evaluate, guide — and, when requested, execute — complex decisions, rather than simply providing information. Legacy products often support workflows that require multi-step decisions and domain expertise — territory users have historically navigated manually, leading to inconsistent decisions and higher error rates. Reasoning Agents embed that intelligence directly into the workflow, turning the product into a working partner.",
    icon: "/reasoning_agent.svg",
    iconHover: "/reasoning_agent_blue.svg",
    video: "/Reasoning_Agents.mp4",
    quote: "Guiding users through complex decisions... and executing actions when asked.",
    smeValue:
      "Introduces intelligent automation capable of navigating legacy complexity, resolving issues, and completing multi-step tasks autonomously.",
    examples: [
      "Exception-handling bots",
      "Reconciliation agents",
      "Scheduling optimizers",
      "Multi-system coordination assistants",
    ],
    readinessRequirements:
      "Clear decision rules, audit trails, deterministic APIs, and safe sandbox environments for testing autonomous behavior.",
    roadmapFit:
      "Advanced modernization stage unlocking semi-autonomous operations and significant efficiency gains.",
  },
  {
    slug: "custom-models",
    title: "Custom AI Models",
    teaser:
      "AI that becomes part of your product's identity — competitive differentiation trained on your own data and workflows.",
    definition:
      "AI models trained or fine-tuned on your own domain, data, and workflows — intelligence no competitor can replicate.",
    overview:
      "Custom AI Models represent the fifth and deepest category in the modernization spectrum — the point where AI becomes a core capability of the product itself. Trained on your domain and data, custom models give your product intelligence that no competitor can replicate — built from your product's own DNA. Legacy products often operate in specialized domains — manufacturing, logistics, finance, healthcare — where patterns and rules run deeper than any generic AI model can fully understand. This is modernization at its most transformative.",
    icon: "/custom_models.svg",
    iconHover: "/custom_models_blue.svg",
    video: "/Custom_AI_Models.mp4",
    quote: "AI that becomes part of your product's identity.",
    smeValue:
      "Injects predictive intelligence into legacy systems, enabling smarter decisions and proactive insights without changing core architecture.",
    examples: [
      "Forecasting",
      "Anomaly detection",
      "Pricing insights",
      "Risk scoring",
      "Domain-specific models for unique business needs",
    ],
    readinessRequirements:
      "Reliable historical data, defined business goals, labeling strategy, and MLOps readiness for training and deployment.",
    roadmapFit:
      "Strategic long-term investment that differentiates the business and transforms legacy software from reactive to proactive.",
  },
];

export function getSolutionBySlug(slug: string): SolutionClass | undefined {
  return SOLUTIONS.find((solution) => solution.slug === slug);
}
