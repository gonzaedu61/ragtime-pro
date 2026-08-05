import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import VertexTriadNav from "@/components/VertexTriadNav";

export const metadata: Metadata = {
  title: "Readiness | The BrokerAI",
  description:
    "The Readiness vertex of the Driving-Triad: evaluating an SME's technical, organizational, financial, and governance capacity to adopt AI.",
};

const CARDS = [
  {
    title: "Technical Capability",
    body: "Data quality, system integration, and infrastructure that determine how smoothly a solution can actually be deployed.",
  },
  {
    title: "Organizational Capability",
    body: "Process stability and internal skills — whether teams and workflows can absorb a new way of working.",
  },
  {
    title: "Financial Capability",
    body: "Budget and resourcing to sustain a solution beyond the pilot, not just fund its initial rollout.",
  },
  {
    title: "Governance Capability",
    body: "Clear ownership, oversight, and compliance processes — including alignment with the EU AI Act — before a solution goes live.",
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
            &ldquo;Ensures the AI adoption at a pace that fits reality — not faster, not
            slower.&rdquo;
          </p>
        </div>
      </section>

      <section className="pt-8 pb-16 lg:grid lg:grid-cols-[calc(50%-26.5rem)_1fr_calc(50%-26.5rem)]">
        <div className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-center lg:col-start-2 lg:row-start-1 lg:h-56 lg:overflow-hidden">
          <p className="font-body text-lg text-charcoal">
            The third vertex of the Driving-Triad, &ldquo;Readiness&rdquo;, assesses the
            technical, organizational, financial, and governance capacity to adopt and sustain a
            given solution. Readiness is often the most overlooked dimension — a business may
            have a clear need and a promising opportunity, but lack the data quality, process
            stability, or internal skills required to implement the solution effectively.
            Readiness ensures that the organizations adopt AI at a pace that fits their reality
            — not faster, not slower.
          </p>
        </div>

        <div className="mx-auto mb-10 flex max-w-4xl justify-center px-6 lg:col-start-1 lg:row-start-1 lg:mb-0 lg:items-center lg:justify-center lg:px-0">
          <VertexTriadNav current="readiness" />
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 px-6 sm:grid-cols-2 lg:col-start-2 lg:row-start-2 lg:-mt-12">
          {CARDS.map((card) => (
            <div key={card.title} className="rounded-lg bg-light-grey p-6 text-center">
              <h2 className="font-heading text-lg font-semibold text-navy">{card.title}</h2>
              <p className="mt-2 font-body text-sm text-charcoal">{card.body}</p>
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
              Setting the roadmap …
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
