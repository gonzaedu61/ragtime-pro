import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ExternalLinkIcon from "@/components/ExternalLinkIcon";
import HeroAvatarVideo from "@/components/HeroAvatarVideo";
import ChatBannerTrigger from "@/components/chat/ChatBannerTrigger";

export const metadata: Metadata = {
  title: "Our Methodology | Ragtime-Pro",
  description:
    "The Product Modernization Triad: Boost Point, Opportunity, and Readiness — the three vertices that shape every AI-driven legacy modernization roadmap.",
};

const PILLARS = [
  {
    slug: "boost-point",
    title: "Boost Point",
    body: "Where AI can create the highest product value with minimal disruption — a workflow that can be automated, a module that can gain intelligence, or a knowledge domain that can be operationalized.",
  },
  {
    slug: "opportunity",
    title: "Opportunity",
    body: "Which AI solution category best fits the Boost Point? We weigh its fit, how mature the underlying technology is, and how much effort it takes to integrate into your product's architecture.",
  },
  {
    slug: "readiness",
    title: "Readiness",
    body: "How prepared the product is for integration — architecture, APIs, data quality, team skills, governance, and industry constraints, assessed before we commit to a path.",
  },
];

export default function MethodologyPage() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Our Methodology</h1>

        <div className="mt-4 flex justify-center lg:absolute lg:left-[-9rem] lg:top-1/2 lg:z-[60] lg:mt-0 lg:-translate-y-1/2">
          <HeroAvatarVideo videoSrc="/Our_Methodology.mp4" imageSrc="/Mary.jpg" />
        </div>
      </section>

      <section className="relative bg-navy py-8">
        <ChatBannerTrigger />
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;Legacy modernization is not a matter of inspiration or experimentation. It
            is a strategic discipline.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:items-center lg:justify-center lg:gap-12">
          <Link
            href="/methodology/process"
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
          <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
            The <strong>Product Modernization Triad</strong> is our strategic framework,
            built on three vertices — <strong>Boost Point</strong>,{" "}
            <strong>Opportunity</strong>, and <strong>Readiness</strong>. Modernizing a
            legacy product is not a linear checklist — it is a strategic decision system.
            Without alignment, even promising AI pilots become isolated experiments. The
            Triad is the compass ensuring every recommendation is checked against where AI
            can create the highest value, the AI Upgrade Module that fits best, and your
            product&apos;s actual readiness to integrate it safely — and it gets
            continuously adjusted as your product and its context evolves.
          </p>
          <div className="flex w-64 shrink-0 flex-col items-center gap-1">
            <Image
              src="/product_modernization_triad.svg"
              alt="Triangle diagram showing the Boost Point, Opportunity, and Readiness triad"
              width={1559}
              height={1399}
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
