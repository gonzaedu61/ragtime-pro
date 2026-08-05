import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";

export const metadata: Metadata = {
  title: "Coaching: The Barrier's Breaker | The BrokerAI",
  description:
    "How structured AI coaching demystifies adoption, bridges the skills gap, reduces resistance, and ensures EU AI Act compliance.",
};

const KEY_BLOCKS = [
  {
    title: "Demystification",
    body: "We translate AI capabilities into plain, practical language tied to your business — no jargon, no hype.",
  },
  {
    title: "Bridging the Skills Gap",
    body: "Hands-on coaching builds your team's confidence to evaluate and adopt AI tools without over-relying on external vendors.",
  },
  {
    title: "Reducing Resistance",
    body: "Structured change management turns hesitant stakeholders into engaged participants in the roadmap.",
  },
  {
    title: "Ensuring Compliance",
    body: "Every recommendation accounts for EU AI Act requirements from the outset, not as an afterthought.",
  },
  {
    title: "Building Confidence",
    body: "The result: a leadership team that understands its AI roadmap and trusts the decisions behind it.",
  },
];

export default function CoachingPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">
          The Barrier&apos;s Breaker
        </h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;Coaching turns uncertainty into a structured and confident path toward
            value.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:justify-center lg:gap-20">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
            <div className="lg:self-start">
              <RoadmapVideoButton
                src="/Barriers_Breaker.mp4"
                ariaLabel="Play the Barrier's Breaker video"
                iconClassName="h-9 w-auto"
              />
            </div>
            <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
              Structured coaching is how The BrokerAI turns each core barrier into a solved
              problem. For most SMEs, the greatest challenge isn&apos;t the technology —
              it&apos;s the uncertainty surrounding it. Coaching replaces guesswork with
              methodology and fragmented experimentation with strategic alignment, giving SMEs
              access to external expertise that understands both AI and the realities of
              small-business operations. Working barrier by barrier, it demystifies AI, builds
              internal skills, brings hesitant teams on board, and keeps every recommendation
              aligned with EU AI Act requirements — turning AI adoption from a risky leap into a
              guided journey.
            </p>
          </div>
          <Link href="/about" className="group flex flex-col items-center gap-4">
            <Image
              src="/logo.png"
              alt="The BrokerAI logo"
              width={374}
              height={362}
              className="h-32 w-auto"
            />
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              We can help you …
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {KEY_BLOCKS.slice(0, 3).map((block) => (
            <div key={block.title} className="rounded-lg bg-light-grey p-6">
              <h2 className="font-heading text-lg font-semibold text-navy">{block.title}</h2>
              <p className="mt-2 font-body text-sm text-charcoal">{block.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {KEY_BLOCKS.slice(3).map((block) => (
            <div
              key={block.title}
              className="w-full rounded-lg bg-light-grey p-6 sm:w-[calc((100%-4rem)/3)]"
            >
              <h2 className="font-heading text-lg font-semibold text-navy">{block.title}</h2>
              <p className="mt-2 font-body text-sm text-charcoal">{block.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
