import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import VertexTriadNav from "@/components/VertexTriadNav";

export const metadata: Metadata = {
  title: "Boost Point | Ragtime-Pro",
  description:
    "The Boost Point vertex of the Product Modernization Triad: the modernization hotspot where AI can create the highest product value with minimal disruption.",
};

const CARDS = [
  {
    title: "Enhanceable User Experiences",
    body: "A user experience that feels dated or effortful — ready for an AI-assisted layer that makes it faster and more intuitive.",
  },
  {
    title: "Automatable Workflows",
    body: "A manual, repetitive workflow that can be handed to AI — reducing friction without touching the surrounding architecture.",
  },
  {
    title: "Modules Ready for Intelligence",
    body: "An existing module that can be upgraded with contextual intelligence, turning a static feature into an adaptive one.",
  },
  {
    title: "Operationalizable Knowledge",
    body: "Documentation, tribal knowledge, or support history that can become a living, queryable capability inside the product.",
  },
  {
    title: "Augmentable Decisions",
    body: "A decision process where users currently rely on guesswork or experience, ready to be guided by AI-driven reasoning.",
  },
];

export default function BoostPointPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">&ldquo;Boost Point&rdquo; Vertex</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;The point in the product where AI can create high value with minimal
            disruption.&rdquo;
          </p>
        </div>
      </section>

      <section className="pt-8 pb-16 lg:grid lg:grid-cols-[calc(50%-26.5rem)_1fr_calc(50%-26.5rem)]">
        <div className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-center lg:col-start-2 lg:row-start-1 lg:h-56 lg:overflow-hidden">
          <p className="font-body text-lg text-charcoal">
            The first vertex of the Product Modernization Triad, <strong>Boost
            Point</strong>, is a modernization hotspot — a place in the product where AI
            can create the highest value with minimal disruption to the existing
            architecture. Our{" "}
            <Link href="/modernization-agent" className="underline hover:text-electric-blue">
              Modernization Agent
            </Link>{" "}
            identifies Boost Points through multi-dimensional analysis of your source
            code, documentation, workflows, customer usage, and competitive gaps.
            Anchoring modernization in Boost Points ensures
            every AI Upgrade Module targets a real, high-value opportunity — not just the
            flashiest technology.
          </p>
        </div>

        <div className="mx-auto mb-10 flex max-w-4xl justify-center px-6 lg:col-start-1 lg:row-start-1 lg:mb-0 lg:items-center lg:justify-center lg:px-0">
          <VertexTriadNav current="boost-point" />
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 px-6 sm:grid-cols-2 lg:col-start-2 lg:row-start-2 lg:-mt-12">
          {CARDS.map((card, index) => {
            const isLast = index === CARDS.length - 1;
            return (
              <div
                key={card.title}
                className={`rounded-lg bg-light-grey p-6 text-center ${
                  isLast ? "mx-auto w-full sm:col-span-2 sm:w-[calc((100%-2rem)/2)]" : ""
                }`}
              >
                <h2 className="font-heading text-lg font-semibold text-navy">{card.title}</h2>
                <p className="mt-2 font-body text-sm text-charcoal">{card.body}</p>
              </div>
            );
          })}
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
