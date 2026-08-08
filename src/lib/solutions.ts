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
      "Small improvements that create immediate value — quick wins that remove everyday friction without touching the architecture.",
    definition:
      "Small, safe, high-impact AI enhancements that improve user productivity without destabilizing the product.",
    overview:
      "Modernizing a legacy product does not necessarily begin with deep architectural change — it begins with small, safe, high-impact enhancements that improve user productivity without destabilizing what already works. Legacy products often carry workflows designed years ago, before modern UX and AI assistance existed, so users still perform repetitive tasks, search through long lists, and navigate complex forms by hand. These enhancements are the lowest-risk modernization category, yet they deliver immediate value: they prove modernization is possible, reduce internal resistance, and build the trust that carries a product into deeper modernization layers.",
    icon: "/personal_productivity.svg",
    iconHover: "/personal_productivity_blue.svg",
    video: "/Personal_Productivity.mp4",
    quote: "Small improvements that create immediate value.",
    smeValue:
      "Immediate, low-risk productivity gains — faster workflows, fewer manual steps, and visible proof that modernization is underway, without touching core architecture.",
    examples: [
      "Smart text generation",
      "Automated summaries",
      "Intelligent search",
      "Guided data entry",
    ],
    readinessRequirements:
      "Safe by design — no core logic changes, no deep refactoring, and no major UI redesign required, making this the easiest entry point regardless of your product's current architecture.",
    roadmapFit:
      "Category 1 in the modernization spectrum — the foundation that prepares your product for workflow automation, RAG assistants, reasoning agents, and custom models.",
  },
  {
    slug: "workflow-automation",
    title: "Intelligent Workflows",
    teaser:
      "AI that removes friction from everyday operations — automating multi-step processes for real operational efficiency.",
    definition:
      "AI-driven intelligence woven into the product's operational backbone, removing friction and accelerating user workflows.",
    overview:
      "Legacy products often contain workflows designed in a different era, before automation and efficiency were competitive differentiators. Over time they accumulate friction: repetitive steps, rigid logic, and slow validation. Intelligent Workflow Automations introduce AI directly into the product's operational backbone, removing that friction. This is often the highest-ROI modernization category — it directly impacts efficiency, support load, and customer retention, making modernization visible and strategically meaningful.",
    icon: "/intelligent_workflows.svg",
    iconHover: "/intelligent_workflows_blue.svg",
    video: "/Intelligent_Workflows.mp4",
    quote: "AI that removes friction from everyday operations.",
    smeValue:
      "Processes become faster, smoother, and more reliable — support tickets drop and customers start to perceive the product as modern and competitive.",
    examples: [
      "Automated validation",
      "Rule-based decision support",
      "Intelligent routing",
      "Automated document processing",
    ],
    readinessRequirements:
      "Deployable one workflow at a time — no core logic replacement, no deep refactoring, and no disruption to workflows that already work.",
    roadmapFit:
      "Category 2 in the modernization spectrum — builds on Personal Productivity and lays the structural foundation for RAG assistants and reasoning agents.",
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
    quote: "AI that operationalizes your product's knowledge.",
    smeValue:
      "Users solve problems faster and rely less on support — RAG is often the moment customers say the product finally feels modern.",
    examples: [
      "Product knowledge assistants",
      "Troubleshooting copilots",
      "Onboarding assistants",
      "Domain-specific Q&A",
    ],
    readinessRequirements:
      "Deployable module by module and restricted to low-risk knowledge categories at first — no core logic changes, and compliance-aligned from day one.",
    roadmapFit:
      "Category 3 in the modernization spectrum — the bridge between workflow automation and true intelligence, preparing the product for reasoning agents and custom models.",
  },
  {
    slug: "reasoning-agents",
    title: "Reasoning Agents",
    teaser:
      "AI that guides users through complex decisions — real-time intelligence for multi-step choices as they happen.",
    definition:
      "AI that interprets, evaluates, and guides users through complex, multi-step decisions — not just retrieving information, but applying it.",
    overview:
      "As products evolve through productivity enhancements, workflow automation, and RAG-based knowledge assistants, they reach a critical modernization milestone: the ability to reason. Reasoning Agents interpret, evaluate, and guide users through complex decisions, rather than simply providing information. Legacy products often support workflows that require multi-step decision sequences and domain-specific expertise — territory users have historically navigated manually, leading to inconsistent decisions and higher error rates. Reasoning Agents embed that intelligence directly into the workflow, turning the product from a tool into a guide.",
    icon: "/reasoning_agent.svg",
    iconHover: "/reasoning_agent_blue.svg",
    video: "/Reasoning_Agents.mp4",
    quote: "AI that guides users through complex decisions.",
    smeValue:
      "Users make better decisions faster and with fewer errors — Reasoning Agents often become a product's most celebrated modernization feature.",
    examples: [
      "Compliance guidance agents",
      "Configuration assistants",
      "Diagnostic agents",
      "Scenario evaluation tools",
    ],
    readinessRequirements:
      "Operates within defined decision boundaries and can be deployed workflow by workflow, monitored and audited throughout — no core logic changes required.",
    roadmapFit:
      "Category 4 in the modernization spectrum — the bridge between knowledge and intelligence, turning a knowledge assistant into a decision partner and preparing the product for custom models.",
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
      "The product gains capabilities competitors cannot replicate — a defensible, domain-specific advantage that becomes the product's signature feature.",
    examples: [
      "Domain-specific prediction models",
      "Anomaly detection",
      "Forecasting engines",
      "Custom embeddings",
    ],
    readinessRequirements:
      "Requires high-quality proprietary data and controlled, continuously monitored integration — typically the most advanced-readiness category, deployed in low-risk contexts first.",
    roadmapFit:
      "Category 5 — the highest level of modernization maturity, building on every category before it. This is where the product becomes AI-native, not just AI-enhanced.",
  },
];

export function getSolutionBySlug(slug: string): SolutionClass | undefined {
  return SOLUTIONS.find((solution) => solution.slug === slug);
}
