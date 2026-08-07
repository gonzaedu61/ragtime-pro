import Image from "next/image";
import Link from "next/link";
import ExternalLinkIcon from "@/components/ExternalLinkIcon";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";
import RotatingHeadline from "@/components/RotatingHeadline";

const VALUE_BLOCKS = [
  {
    title: "Modernization Is Complex — We Bring Structure",
    description:
      "We analyze your product end-to-end, map its architecture, and identify modernization Boost Points that deliver maximum value with minimum disruption.",
    href: "/methodology",
  },
  {
    title: "Powered by Our Modernization Agent",
    description:
      "Our proprietary Modernization Agent analyzes your product end-to-end, identifies Boost Points, and generates the AI Upgrade Modules our consultants develop and integrate — AI to modernize AI.",
    href: "/about",
  },
  {
    title: "AI Upgrade Modules",
    description:
      "We integrate targeted AI capabilities — RAG assistants, workflow intelligence, reasoning agents — directly into your product, aligned with your architecture and customer needs.",
    href: "/solutions",
  },
  {
    title: "Incremental Modernization, Not Big-Bang Rewrites",
    description:
      "Guided by our Product-Modernization Triad — Boost Point, Opportunity, and Readiness — we sequence each upgrade step by step, ensuring stability, continuity, and customer trust.",
    href: "/engagement-model",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-20 text-center">
        <RotatingHeadline />
        <p className="mt-6 font-body text-lg text-charcoal">
          A safe, structured, and high‑impact approach to AI‑driven modernization for legacy software products.
        </p>
        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:justify-center">
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
          <RoadmapVideoButton
            label="Watch the AI-Roadmap-Guide video"
            lowBandwidthSrc="/AI_Roadmap_Guide_lowbandwidth.mp4"
            ariaLabel="Play the AI Roadmap Guide video"
            blueHoverIcon={false}
          />
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
