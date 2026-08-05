import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ExternalLinkIcon from "@/components/ExternalLinkIcon";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";
import { SOLUTIONS } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "AI Solution Categories | The BrokerAI",
  description:
    "Five classes of AI solutions for SMEs: personal productivity, workflow automation, RAG, reasoning agents, and custom AI models.",
};

export default function SolutionsPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">AI Solution Categories</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white lg:whitespace-nowrap">
            &ldquo;AI adoption is not a binary choice. It is a path to select the right
            solution at the right time.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:justify-center lg:gap-20">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
            <div className="lg:self-start">
              <RoadmapVideoButton
                src="/AI_Solutions.mp4"
                ariaLabel="Play the AI Solutions video"
                iconClassName="h-9 w-auto"
              />
            </div>
            <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
              A five-tier model for matching the right kind of AI to the right problem — from
              personal productivity to custom models. AI isn&apos;t a single technology or
              product category; it&apos;s a broad ecosystem of capabilities, each solving
              different problems, each requiring a different level of readiness, and each
              offering a different form of value. Without a structured map, organizations often start in
              the wrong place — testing whatever tool is easiest to try rather than the one
              aligned with their most pressing need. The five classes below organize that
              landscape by complexity, integration, and strategic impact, so you can see not
              just what&apos;s possible, but where to begin based on your own readiness and
              priorities.
            </p>
          </div>
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

      <section className="mx-auto flex max-w-7xl flex-wrap justify-center gap-8 px-6 pb-16">
        {SOLUTIONS.map((solution) => (
          <Link
            key={solution.slug}
            href={`/solutions/${solution.slug}`}
            className="group relative w-full rounded-lg border border-transparent bg-light-grey p-6 pb-10 transition-all hover:-translate-y-1 hover:border-electric-blue hover:shadow-md sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
          >
            <h2 className="font-heading text-lg font-semibold text-navy group-hover:text-electric-blue">
              {solution.title}
            </h2>
            <p className="mt-2 font-body text-sm text-charcoal">{solution.teaser}</p>
            <ExternalLinkIcon className="absolute bottom-4 right-4 h-5 w-5 text-charcoal/40 transition-colors group-hover:text-electric-blue" />
          </Link>
        ))}
      </section>
    </>
  );
}
