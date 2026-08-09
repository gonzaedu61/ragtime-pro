import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import VertexTriadNav from "@/components/VertexTriadNav";

export const metadata: Metadata = {
  title: "Readiness | Ragtime-Pro",
  description:
    "The Readiness vertex of the Product Modernization Triad: how prepared the product is to safely integrate the selected AI Upgrade Module.",
};

const CARDS = [
  {
    title: "Architecture & APIs",
    body: "How well the product's existing architecture and integration points can absorb a new AI capability without destabilizing what already works.",
  },
  {
    title: "Data & Documentation",
    body: "Whether the data quality and documentation available are sufficient for the Modernization Agent — and the module itself — to work with reliably.",
  },
  {
    title: "Team & Governance",
    body: "Whether internal skills and clear ownership are in place to build, oversee, and maintain the module once it's live.",
  },
  {
    title: "Industry & Compliance",
    body: "Whether industry-specific constraints and the product's compliance posture — including the EU AI Act — are accounted for before deployment.",
  },
];

export default function ReadinessPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">&ldquo;Readiness&rdquo; Vertex</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;How prepared the product is to safely integrate a new AI Upgrade
            Module?&rdquo;
          </p>
        </div>
      </section>

      <section className="pt-8 pb-16 lg:grid lg:grid-cols-[calc(50%-26.5rem)_1fr_calc(50%-26.5rem)]">
        <div className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-center lg:col-start-2 lg:row-start-1 lg:h-56 lg:overflow-hidden">
          <p className="font-body text-lg text-charcoal">
            The third vertex of the Product Modernization Triad, <strong>Readiness</strong>,
            assesses how prepared the product is for integration. Even when a Boost Point
            and Opportunity are clear, modernization must respect the product&apos;s current
            readiness — its architecture, APIs, data quality, documentation, team skills,
            governance, industry constraints, and compliance posture. Readiness answers a
            single question: can we safely modernize this now? It is the guardrail of
            modernization.
          </p>
        </div>

        <div className="mx-auto mb-10 flex max-w-4xl justify-center px-6 lg:col-start-1 lg:row-start-1 lg:mb-0 lg:items-center lg:justify-center lg:px-0">
          <VertexTriadNav current="readiness" />
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 px-6 sm:grid-cols-2 lg:col-start-2 lg:row-start-2 lg:-mt-12">
          {CARDS.map((card) => (
            <div key={card.title} className="rounded-lg bg-light-grey p-6 text-center">
              <h2 className="font-heading text-lg font-semibold text-navy">{card.title}</h2>
              <p className="mt-2 font-body text-sm text-charcoal">
                {card.title === "Industry & Compliance" ? (
                  <>
                    Whether industry-specific constraints and the product&apos;s compliance
                    posture — including{" "}
                    <Link href="/eu-ai-act-compliance" className="underline hover:text-electric-blue">
                      the EU AI Act
                    </Link>{" "}
                    — are accounted for before deployment.
                  </>
                ) : card.title === "Data & Documentation" ? (
                  <>
                    Whether the data quality and documentation available are sufficient
                    for the{" "}
                    <Link href="/engagement-model" className="underline hover:text-electric-blue">
                      Modernization Agent
                    </Link>{" "}
                    — and the module itself — to work with reliably.
                  </>
                ) : (
                  card.body
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl justify-center px-6 lg:col-start-3 lg:row-start-1 lg:mt-0 lg:items-center lg:justify-center lg:px-0">
          <Link href="/methodology" className="group flex flex-col items-center gap-4">
            <Image
              src="/roadmap.svg"
              alt="Roadmap icon"
              width={198}
              height={263}
              className="h-32 w-auto"
            />
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Understand the Modernization-Triad ...
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
