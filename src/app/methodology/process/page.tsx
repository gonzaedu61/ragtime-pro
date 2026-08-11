import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HeroAvatarVideo from "@/components/HeroAvatarVideo";

export const metadata: Metadata = {
  title: "The Modernization Journey | Ragtime-Pro",
  description:
    "The eight-step process behind every Ragtime-Pro modernization engagement — from product discovery to guided implementation.",
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
    title: "AI Solution Category Alignment",
    body: "Each opportunity is mapped to one of the five AI Solution Categories, aligning modernization with your product's maturity and readiness.",
    icon: "/step_3.svg",
  },
  {
    title: "Standard Ragtime-Pro Modules Mapping",
    body: "We match each opportunity to Ragtime-Pro's library of pre-built AI Upgrade Modules — reusing one where it fits, or generating a new module for any gap.",
    icon: "/step_4.svg",
  },
  {
    title: "Modernization Sequencing",
    body: "We determine what to modernize first, next, and later — and what needs architectural preparation first — in a Modernization Sequence Plan.",
    icon: "/step_5.svg",
  },
  {
    title: "Risk & Compliance Assessment",
    body: "We evaluate EU AI Act implications, data governance, transparency, auditability, and human oversight before any step proceeds.",
    icon: "/step_6.svg",
  },
  {
    title: "Modernization Blueprint Creation",
    body: "We produce a Modernization Blueprint — goals, sequence, integration paths, compliance alignment, expected ROI, and a rollout plan.",
    icon: "/step_7.svg",
  },
  {
    title: "Guided Implementation",
    body: "We work alongside your team on safe, incremental rollout, customer-aware deployment, monitoring, and iterative refinement.",
    icon: "/step_8.svg",
  },
];

export default function ModernizationProcessPage() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">The Modernization Journey</h1>

        <div className="mt-4 flex justify-center lg:absolute lg:left-[-9rem] lg:top-1/2 lg:z-[60] lg:mt-0 lg:-translate-y-1/2">
          <HeroAvatarVideo videoSrc="/The_Steps.mp4" imageSrc="/Mary.jpg" />
        </div>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;Turning AI modernization from a risky leap into a guided
            evolution.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-center lg:gap-16">
          <p className="font-body text-lg text-charcoal lg:max-w-2xl lg:text-left">
            Legacy modernization is not a matter of inspiration or experimentation — it is a
            strategic discipline. Our methodology follows a structured, repeatable sequence,
            powered by the{" "}
            <Link href="/modernization-agent" className="underline hover:text-electric-blue">
              <strong>Modernization Agent</strong>
            </Link>{" "}
            and executed by our consultants, that turns your product&apos;s architecture,
            workflows, and constraints into a safe, incremental modernization roadmap.
          </p>
          <Link href="/methodology" className="group flex flex-col items-center gap-4">
            <Image
              src="/roadmap.svg"
              alt="Roadmap icon"
              width={198}
              height={263}
              className="h-32 w-auto"
            />
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Check the Product Modernization Triad ...
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.slice(0, 6).map((step) => (
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
                  {step.title}
                </h2>
              </div>
              <p className="mt-2 font-body text-sm text-charcoal">
                {step.title === "Risk & Compliance Assessment" ? (
                  <>
                    We evaluate{" "}
                    <Link href="/eu-ai-act-compliance" className="underline hover:text-electric-blue">
                      EU AI Act
                    </Link>{" "}
                    implications, data governance, transparency, auditability, and human
                    oversight before any step proceeds.
                  </>
                ) : step.title === "Modernization Opportunity Analysis" ? (
                  <>
                    The{" "}
                    <Link href="/modernization-agent" className="underline hover:text-electric-blue">
                      Modernization Agent
                    </Link>{" "}
                    surfaces friction points, bottlenecks, knowledge gaps, and automation
                    opportunities, producing a Modernization Opportunity Matrix.
                  </>
                ) : (
                  step.body
                )}
              </p>
            </li>
          ))}
        </ol>
        <ol className="mt-6 flex flex-col gap-6 sm:flex-row sm:justify-center">
          {STEPS.slice(6).map((step) => (
            <li
              key={step.title}
              className="rounded-lg bg-light-grey p-6 sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
            >
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
                  {step.title}
                </h2>
              </div>
              <p className="mt-2 font-body text-sm text-charcoal">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
