import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ExternalLinkIcon from "@/components/ExternalLinkIcon";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";
import { SOLUTIONS } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "AI Solution Categories | Ragtime-Pro",
  description:
    "Five AI Solution Categories for legacy software modernization: personal productivity, workflow automation, RAG, reasoning agents, and custom AI models.",
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
            &ldquo;There is no single AI solution — only the right category for the right
            challenge.&rdquo;
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
              Modernizing a legacy software product is not a single leap — it is a
              structured progression. Different products, architectures, and customer
              bases require different modernization intensities, so we organize
              modernization into five AI Solution Categories, each a distinct layer of
              capability, complexity, and value. Each category can be integrated
              incrementally, and is analyzed and sequenced by our Modernization Agent to
              ensure safe integration into your legacy architecture.
              These categories are not a menu of features to pick from — they are
              carefully crafted into a roadmap, letting you modernize confidently without
              overwhelming your team or destabilizing your product.
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
