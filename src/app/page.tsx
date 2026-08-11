import Image from "next/image";
import Link from "next/link";
import ExternalLinkIcon from "@/components/ExternalLinkIcon";
import HeroAvatarVideo from "@/components/HeroAvatarVideo";
import RotatingHeadline from "@/components/RotatingHeadline";

const VALUE_BLOCKS = [
  {
    title: "We Bring Structure",
    description:
      "We analyze your product end-to-end, map its architecture, and identify modernization Boost Points that deliver maximum value with minimum disruption.",
    href: "/methodology/boost-point",
  },
  {
    title: "Our Modernization Agent",
    description:
      "Trained specifically for legacy modernization, our proprietary AI Agent carries the bulk of the analytical and code-generation work. Our consultants act as the human factor, validating each step to keep the transformation safe.",
    href: "/modernization-agent",
  },
  {
    title: "Incremental Modernization",
    description:
      "Guided by our Product-Modernization Triad — Boost Point, Opportunity, and Readiness — we sequence each upgrade step by step, ensuring stability, continuity, and customer trust.",
    href: "/methodology",
  },
  {
    title: "AI Upgrade Modules",
    description:
      "The final result is a set of targeted AI capabilities — productivity boosters, RAG assistants, intelligent workflows, reasoning agents, custom models — directly integrated into your product, aligned with your architecture and customer needs.",
    href: "/solutions",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-10 lg:grid lg:grid-cols-[calc(50%-33rem)_1fr] lg:items-center lg:gap-x-6">
        <div className="text-center lg:col-start-2 lg:row-start-1">
          <RotatingHeadline />
        </div>

        <div className="mt-4 flex justify-center lg:col-start-1 lg:row-start-1 lg:mt-0 lg:justify-start">
          <HeroAvatarVideo />
        </div>

        <p className="mt-6 text-center font-body text-xl text-charcoal lg:col-start-2 lg:row-start-2">
          A safe, structured, and effective approach to AI‑driven modernization for legacy software products.
        </p>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:justify-center sm:gap-20 lg:col-start-2 lg:row-start-3">
          <Link href="/start" className="group flex flex-col items-center gap-3">
            <span className="rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Start the journey …
            </span>
            <Image
              src="/start.svg"
              alt=""
              width={124}
              height={132}
              className="h-12 w-auto"
            />
          </Link>
          <Link href="/contact" className="group flex flex-col items-center gap-3">
            <span className="rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Book an Intro Call
            </span>
            <Image
              src="/discovery_call.svg"
              alt=""
              width={124}
              height={132}
              className="h-12 w-auto"
            />
          </Link>
        </div>
      </section>

      <section className="bg-light-grey">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:grid-cols-2">
          {VALUE_BLOCKS.map((block) => (
            <Link
              key={block.title}
              href={block.href}
              className="group relative block rounded-lg border border-transparent bg-white p-6 pb-10 shadow-sm transition-all hover:-translate-y-1 hover:border-electric-blue hover:shadow-md"
            >
              <h2 className="font-heading text-lg font-semibold text-navy transition-colors group-hover:text-electric-blue">
                {block.title}
              </h2>
              <p className="mt-2 font-body text-sm text-charcoal">{block.description}</p>
              <ExternalLinkIcon className="absolute bottom-4 right-4 h-5 w-5 text-charcoal/40 transition-colors group-hover:text-electric-blue" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
