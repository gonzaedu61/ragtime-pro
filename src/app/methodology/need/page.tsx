import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import VertexTriadNav from "@/components/VertexTriadNav";

export const metadata: Metadata = {
  title: "Need | The BrokerAI",
  description:
    "The Need vertex of the Driving-Triad: anchoring AI adoption in the business problem or ambition with the highest urgency and impact.",
};

const CARDS = [
  {
    title: "Reducing Operational Friction",
    body: "Automating repetitive, manual processes so teams spend less time fighting friction and more time on work that actually moves the business forward.",
  },
  {
    title: "Improving Customer Experience",
    body: "AI-driven tools that respond faster, personalize interactions, and remove friction from every customer touchpoint.",
  },
  {
    title: "Improving Quality Through Insight",
    body: "AI that spots issues humans miss, helping teams refine products, services, and processes with data-driven clarity and precision.",
  },
  {
    title: "Unlocking New Revenue Potential",
    body: "Using AI to uncover new products, services, or business models that create measurable top-line growth.",
  },
];

export default function NeedPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">&ldquo;Need&rdquo; Vertex</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;AI must be adopted to solve real problems, not to follow a trend.&rdquo;
          </p>
        </div>
      </section>

      <section className="pt-8 pb-16 lg:grid lg:grid-cols-[calc(50%-26.5rem)_1fr_calc(50%-26.5rem)]">
        <div className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-center lg:col-start-2 lg:row-start-1 lg:h-56 lg:overflow-hidden">
          <p className="font-body text-lg text-charcoal">
            The first vertex of the Driving-Triad, &ldquo;Need&rdquo;, focuses on the business
            problem or ambition with the highest urgency and impact. AI should never be adopted
            because
            it&apos;s fashionable or because competitors are experimenting — it should be
            adopted because it solves a real problem: reducing operational friction, improving
            customer experience, strengthening compliance, or unlocking new revenue potential. By
            anchoring decisions in Need, SMEs avoid the trap of technology-driven adoption and
            instead pursue value-driven transformation.
          </p>
        </div>

        <div className="mx-auto mb-10 flex max-w-4xl justify-center px-6 lg:col-start-1 lg:row-start-1 lg:mb-0 lg:items-center lg:justify-center lg:px-0">
          <VertexTriadNav current="need" />
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
