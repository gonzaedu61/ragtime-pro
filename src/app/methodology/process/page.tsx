import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Modernization Journey | Ragtime-Pro",
  description:
    "The seven-step process behind every Ragtime-Pro modernization engagement — from product discovery to guided implementation.",
};

const STEPS = [
  {
    title: "Product Discovery & Context Mapping",
    body: "We map your architecture, domain, customer base, workflows, and constraints into a single Product Context Map — the foundation of the modernization strategy.",
    icon: "/step_1.svg",
  },
  {
    title: "Modernization Opportunity Analysis",
    body: "The Modernization Agent surfaces friction points, bottlenecks, knowledge gaps, and automation opportunities, producing a Modernization Opportunity Matrix.",
    icon: "/step_2.svg",
  },
  {
    title: "Modernization Sequencing",
    body: "We determine what to modernize first, next, and later — and what needs architectural preparation first — in a Modernization Sequence Plan.",
    icon: "/step_3.svg",
  },
  {
    title: "AI Solution Category Alignment",
    body: "Each opportunity is mapped to one of the five AI Solution Categories, aligning modernization with your product's maturity and readiness.",
    icon: "/step_4.svg",
  },
  {
    title: "Risk & Compliance Assessment",
    body: "We evaluate EU AI Act implications, data governance, transparency, auditability, and human oversight before any step proceeds.",
    icon: "/step_5.svg",
  },
  {
    title: "Modernization Blueprint Creation",
    body: "We produce a Modernization Blueprint — goals, sequence, integration paths, compliance alignment, expected ROI, and a rollout plan.",
    icon: "/step_6.svg",
  },
  {
    title: "Guided Implementation",
    body: "We work alongside your team on safe, incremental rollout, customer-aware deployment, monitoring, and iterative refinement.",
    icon: "/step_6.svg",
  },
];

export default function ModernizationProcessPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">The Modernization Journey</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;This methodology transforms modernization from a risky leap into a
            guided evolution.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-center">
        <p className="font-body text-lg text-charcoal">
          Legacy modernization is not a matter of inspiration or experimentation — it is a
          strategic discipline. Our methodology follows a structured, repeatable sequence,
          powered by the <strong>Modernization Agent</strong> and executed by our
          consultants, that turns your product&apos;s architecture, workflows, and
          constraints into a safe, incremental modernization roadmap.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-lg bg-light-grey p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-24 shrink-0">
                  <Image
                    src={step.icon}
                    alt=""
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <h2 className="font-heading text-lg font-semibold text-navy">
                  {index + 1}. {step.title}
                </h2>
              </div>
              <p className="mt-2 font-body text-sm text-charcoal">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 flex justify-center">
        <Link href="/methodology" className="group flex flex-col items-center gap-4">
          <Image
            src="/roadmap.svg"
            alt="Roadmap icon"
            width={198}
            height={263}
            className="h-32 w-auto"
          />
          <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
            Back to Our Methodology …
          </span>
        </Link>
      </section>
    </>
  );
}
