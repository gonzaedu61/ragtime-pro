import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import VertexTriadNav from "@/components/VertexTriadNav";

export const metadata: Metadata = {
  title: "Opportunity | The BrokerAI",
  description:
    "The Opportunity vertex of the Driving-Triad: matching each business need to the best-fit AI solution class.",
};

const CARDS = [
  {
    title: "Fit for the Problem",
    body: "How clearly an AI capability matches the actual business challenge, avoiding solutions that are simply not designed for the problem at hand.",
  },
  {
    title: "Technology Maturity",
    body: "How proven and production-ready a given AI capability is today, versus still emerging or unproven for SME use.",
  },
  {
    title: "Risk Appetite",
    body: "How much uncertainty, change, and investment the business is genuinely willing to take on at this stage.",
  },
];

export default function OpportunityPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">&ldquo;Opportunity&rdquo; Vertex</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;Pick the right AI solution at the right point in time.&rdquo;
          </p>
        </div>
      </section>

      <section className="pt-8 pb-16 lg:grid lg:grid-cols-[calc(50%-26.5rem)_1fr_calc(50%-26.5rem)]">
        <div className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-center lg:col-start-2 lg:row-start-1 lg:h-56 lg:overflow-hidden">
          <p className="font-body text-lg text-charcoal">
            The second vertex of the Driving-Triad, &ldquo;Opportunity&rdquo;, identifies the AI
            solution category best suited to the need. Not every problem requires a custom
            model. Not
            every workflow needs automation. Not every knowledge gap calls for a RAG system.
            The Opportunity vertex ensures the organization selects the solution category based
            on fit for the problem, the maturity and availability of the underlying technology,
            and the organization&apos;s own willingness to take on risk — preventing
            overinvestment, underinvestment, and misalignment between expectations and
            capabilities.
          </p>
        </div>

        <div className="mx-auto mb-10 flex max-w-4xl justify-center px-6 lg:col-start-1 lg:row-start-1 lg:mb-0 lg:items-center lg:justify-center lg:px-0">
          <VertexTriadNav current="opportunity" />
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 px-6 sm:grid-cols-3 lg:col-start-2 lg:row-start-2 lg:-mt-12">
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
