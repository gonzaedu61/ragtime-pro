import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";

export const metadata: Metadata = {
  title: "Core Barriers to AI Adoption | The BrokerAI",
  description:
    "The four barriers holding SMEs back from AI adoption: cost perception, skills gap, organizational resistance, and EU AI Act compliance.",
};

const BARRIERS = [
  {
    title: "Cost Perception",
    body: "Fear of choosing wrong becomes a financial barrier.",
  },
  {
    title: "Skills Gap",
    body: "Teams often lack the internal expertise to evaluate, implement, or trust AI tools with confidence.",
  },
  {
    title: "Organizational Resistance",
    body: "Change meets hesitation — from leadership uncertainty to team-level pushback against new ways of working.",
  },
  {
    title: "Compliance & Ethics",
    body: "Navigating evolving EU regulations adds a layer of risk that many SMEs aren't equipped to manage alone.",
  },
];

export default function CoreBarriersPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Core Barriers</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;These barriers are real — but they are also solvable.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:justify-center lg:gap-20">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
            <div className="lg:self-start">
              <RoadmapVideoButton
                src="/The_Core_Barriers.mp4"
                ariaLabel="Play the Core Barriers video"
                iconClassName="h-9 w-auto"
              />
            </div>
            <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
              Four barriers consistently stand between SMEs and confident AI adoption. They
              aren&apos;t signs of weakness — they&apos;re natural consequences of operating with
              limited resources, lean teams, and constant pressure to maintain stability. AI
              promises transformation, but transformation requires clarity, and clarity is often
              what&apos;s missing. The result is a landscape where SMEs feel both motivated and
              constrained: they see the opportunity but fear the complexity, want to innovate but
              worry about risk, and recognize the need to modernize without a clear roadmap for
              doing so. With structured guidance and practical coaching, these barriers can be
              overcome one at a time.
            </p>
          </div>
          <Link
            href="/ai-dilemma/coaching"
            className="group flex flex-col items-center gap-4"
          >
            <Image
              src="/broken_barrier.svg"
              alt="Broken barrier icon"
              width={435}
              height={281}
              className="h-24 w-auto"
            />
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Break the barriers …
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 sm:grid-cols-2">
        {BARRIERS.map((barrier) => (
          <div key={barrier.title} className="rounded-lg bg-light-grey p-6">
            <h2 className="font-heading text-lg font-semibold text-navy">{barrier.title}</h2>
            <p className="mt-2 font-body text-sm text-charcoal">{barrier.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
