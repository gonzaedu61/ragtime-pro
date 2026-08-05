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
      "AI as a personal amplifier — drafting, summarizing, and accelerating everyday individual work.",
    definition:
      "AI tools that amplify individual output — drafting, summarizing, researching, and organizing work faster than manual effort allows.",
    overview:
      "AI tools that amplify individual output — drafting, summarizing, researching, and organizing work faster than manual effort allows. For SMEs, this is where AI adoption typically begins: immediate, low-risk productivity gains that require no changes to core systems or processes, and no disruption to how the business already runs. It's the lowest-risk entry point in the roadmap, building the team's familiarity and confidence with AI before moving on to automation or custom-built solutions.",
    icon: "/personal_productivity.svg",
    iconHover: "/personal_productivity_blue.svg",
    video: "/Personal_Productivity.mp4",
    quote: "The easiest and fastest way to experience tangible AI benefits.",
    smeValue:
      "Immediate, low-risk productivity gains without changing core systems or processes.",
    examples: [
      "AI writing assistants",
      "Meeting summarizers",
      "Email drafting tools",
      "Research copilots",
    ],
    readinessRequirements:
      "Basic digital literacy and willingness to adopt new daily tools; minimal IT involvement.",
    roadmapFit:
      "Often the first, lowest-risk step in an AI roadmap — building familiarity before tackling automation or custom builds.",
  },
  {
    slug: "workflow-automation",
    title: "Intelligent Workflows",
    teaser:
      "AI woven into existing processes, removing repetitive steps, reducing manual handoffs, and handling cases where fixed rules fall short.",
    definition:
      "AI embedded directly into existing business processes to remove repetitive manual steps.",
    overview:
      "AI embedded directly into existing business processes to remove repetitive manual steps. Traditional automation handles predictable, rule-based tasks; AI-enhanced automation adds reasoning, classification, and decision-making at key points. By automating tasks like invoice processing, lead routing, scheduling, and document classification, it frees staff time from repetitive work and reduces error rates across day-to-day operations.",
    icon: "/intelligent_workflows.svg",
    iconHover: "/intelligent_workflows_blue.svg",
    video: "/Intelligent_Workflows.mp4",
    quote: "Automations, … yes. — But smarter ones.",
    smeValue:
      "Frees staff time from repetitive tasks and reduces error rates in operational workflows.",
    examples: [
      "Automated invoice processing",
      "Lead routing",
      "Scheduling",
      "Document classification",
    ],
    readinessRequirements:
      "Documented (or discoverable) processes and the willingness to standardize workflows before automating them.",
    roadmapFit:
      "A natural second step once teams are comfortable with AI tools, targeting specific operational bottlenecks.",
  },
  {
    slug: "rag-solutions",
    title: "RAG Solutions",
    teaser:
      "AI becomes a knowledge assistant that operationalizes the organization's collective intelligence.",
    definition:
      "AI becomes a knowledge assistant that operationalizes the organization's collective intelligence.",
    overview:
      "AI becomes a knowledge assistant that operationalizes the organization's collective intelligence. It is the moment when AI begins to understand the business, not just automate its tasks. By grounding assistants in internal documentation, RAG solutions make the organization's own knowledge instantly searchable and usable, cutting the time lost hunting for answers. It's a mid-roadmap step: once workflows are automated, RAG unlocks the knowledge base sitting behind them.",
    icon: "/RAG.svg",
    iconHover: "/RAG_blue.svg",
    video: "/RAG_Solutions.mp4",
    quote:
      "Combine AI reasoning with the pulling of the right information from your trusted sources.",
    smeValue:
      "Makes internal knowledge instantly searchable and understandable, revamping the organization's collective intelligence.",
    examples: [
      "Internal knowledge assistants",
      "Customer support copilots",
      "Policy Q&A tools",
    ],
    readinessRequirements:
      "Accessible internal knowledge, written or verbal, which can be documented and organized with a clear data governance approach.",
    roadmapFit:
      "Mid-roadmap — once workflows are automated, RAG solutions unlock the organization's existing knowledge base.",
  },
  {
    slug: "reasoning-agents",
    title: "Reasoning Agents",
    teaser:
      "AI that provides instant cross-domain insights from open questions, and executes multi-step tasks autonomously and safely.",
    definition:
      "AI systems that plan and execute multi-step tasks with a degree of autonomy, within defined guardrails.",
    overview:
      "AI systems that plan and execute multi-step tasks with a high degree of autonomy, but still within clearly defined guardrails. They elevate AI from being a supportive tool to become a strategic co-worker. They deliver both immediate cross-domain insights from open questions and the execution of complex operational tasks, handling multi-step work that goes beyond single-prompt automation, with human oversight built in wherever it's needed.",
    icon: "/reasoning_agent.svg",
    iconHover: "/reasoning_agent_blue.svg",
    video: "/Reasoning_Agents.mp4",
    quote:
      "Bring real-time visibility and execute complex, autonomous multi-task operations across the business.",
    smeValue:
      "Handles complex, multi-step work that goes beyond single-prompt automation, with human oversight where needed.",
    examples: [
      "Multi-step research agents",
      "Autonomous scheduling and coordination",
      "Autonomous smart customer interaction",
    ],
    readinessRequirements:
      "Mature governance, clear escalation rules, and monitoring in place before granting autonomy.",
    roadmapFit:
      "A later-stage roadmap step, layered on top of workflow automation and RAG once trust and governance are established.",
  },
  {
    slug: "custom-models",
    title: "Custom AI Models",
    teaser: "Purpose-built models tailored to your data and domain, where off-the-shelf tools fall short.",
    definition: "Purpose-built AI models trained or fine-tuned on your own data and domain.",
    overview:
      "Purpose-built AI models trained or fine-tuned on your own data and domain. This is where AI stops being something the business merely uses and becomes something it creates and owns. Custom models deliver capabilities off-the-shelf tools simply can't, tailored precisely to a proprietary use case. It's the most advanced stage of the roadmap, reserved for cases where standard tools fall short of what the business actually needs.",
    icon: "/custom_models.svg",
    iconHover: "/custom_models_blue.svg",
    video: "/Custom_AI_Models.mp4",
    quote:
      "Intelligence built around unique business patterns — AI is not just used. It is created.",
    smeValue:
      "Delivers capabilities that off-the-shelf tools can't provide, tailored to a proprietary use case, and built as a strategic asset which strengthens long-term competitive advantage.",
    examples: [
      "Domain-specific classification models",
      "Proprietary forecasting models",
      "Models fine-tuned on specialized industry data",
    ],
    readinessRequirements:
      "Sufficient proprietary data, technical capacity (in-house or via The BrokerAI's network), and a clear ROI case.",
    roadmapFit:
      "The most advanced roadmap stage, reserved for cases where standard tools can't meet the need.",
  },
];

export function getSolutionBySlug(slug: string): SolutionClass | undefined {
  return SOLUTIONS.find((solution) => solution.slug === slug);
}
