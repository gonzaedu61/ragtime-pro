import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ExternalLinkIcon from "@/components/ExternalLinkIcon";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";

export const metadata: Metadata = {
  title: "Our Methodology | The BrokerAI",
  description:
    "The Driving-Triad framework: Need, Opportunity, and Readiness — the three vertices that shape every AI roadmap.",
};

const PILLARS = [
  {
    slug: "need",
    title: "Need",
    body: "What does the business actually require? We start by identifying the real operational or strategic need — not the flashiest technology.",
  },
  {
    slug: "opportunity",
    title: "Opportunity",
    body: "What AI solution and why? We select the best fit for the need, considering technological maturity, practical availability, and the risk appetite.",
  },
  {
    slug: "readiness",
    title: "Readiness",
    body: "Is the organization able to execute and sustain the solution? We assess skills, resources, data, culture, and governance before committing to a path.",
  },
];

export default function MethodologyPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Our Methodology</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;Adopting AI is not simply a matter of choosing tools. It is a matter of
            choosing direction.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:items-center lg:justify-center lg:gap-12">
          <Link
            href="/engagement-model"
            className="group flex shrink-0 flex-col items-center gap-3"
          >
            <Image
              src="/steps.svg"
              alt="Steps icon"
              width={677}
              height={210}
              className="h-12 w-auto"
            />
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Check the steps ...
            </span>
          </Link>
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
            <div className="shrink-0 lg:self-start">
              <RoadmapVideoButton
                src="/Our_Methodology.mp4"
                ariaLabel="Play the Our Methodology video"
                iconClassName="h-9 w-auto"
              />
            </div>
            <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
              The <strong>Driving-Triad</strong> is a strategic framework built on three
              vertices — <strong>Need</strong>, <strong>Opportunity</strong>, and{" "}
              <strong>Readiness</strong>. Adopting AI is not about choosing tools — it is
              about choosing direction. Without alignment, even promising pilots become
              isolated experiments. The Driving-Triad is the compass ensuring that every
              recommendation is checked against a real business need, the right-fit
              opportunity, and the organization&apos;s actual readiness to execute — and it
              adapts continuously as all three evolve.
            </p>
          </div>
          <div className="flex w-64 shrink-0 flex-col items-center gap-1">
            <Image
              src="/methodology-triad.png"
              alt="Triangle diagram showing the Need, Opportunity, and Readiness triad"
              width={1507}
              height={1286}
              priority
              className="h-auto w-full"
            />
            <p className="font-heading text-base font-medium text-navy">
              The roadmap adapts dynamically as these three vertices evolve.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 sm:grid-cols-3">
        {PILLARS.map((pillar) => {
          const bodyParts = pillar.body.split("AI solution");
          return (
            <div
              key={pillar.slug}
              className="group relative rounded-lg border border-transparent bg-light-grey p-6 pb-10 text-center transition-all hover:-translate-y-1 hover:border-electric-blue hover:shadow-md"
            >
              <Link
                href={`/methodology/${pillar.slug}`}
                aria-label={pillar.title}
                className="absolute inset-0 z-0"
              />
              <h2 className="pointer-events-none relative z-10 font-heading text-lg font-semibold text-navy group-hover:text-electric-blue">
                {pillar.title}
              </h2>
              <p className="relative z-10 mt-2 font-body text-sm text-charcoal">
                {bodyParts.length > 1
                  ? bodyParts.map((part, index) => (
                      <span key={index}>
                        {part}
                        {index < bodyParts.length - 1 && (
                          <Link
                            href="/solutions"
                            className="relative z-10 underline hover:text-electric-blue"
                          >
                            AI Solution
                          </Link>
                        )}
                      </span>
                    ))
                  : pillar.body}
              </p>
              <ExternalLinkIcon className="pointer-events-none absolute bottom-4 right-4 h-5 w-5 text-charcoal/40 transition-colors group-hover:text-electric-blue" />
            </div>
          );
        })}
      </section>
    </>
  );
}
