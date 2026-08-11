import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HeroAvatarVideo from "@/components/HeroAvatarVideo";

export const metadata: Metadata = {
  title: "Core Barriers to Modernization | Ragtime-Pro",
  description:
    "The four barriers holding legacy software vendors back from AI modernization: cost perception, skills gap, organizational resistance, and compliance & ethics.",
};

const BARRIERS = [
  {
    title: "Cost Perception",
    body: "Modernization feels expensive and unpredictable — but the real cost isn't modernizing, it's stagnation: declining competitiveness, rising maintenance costs, and customer churn.",
  },
  {
    title: "Skills Gap",
    body: "Your team knows the product deeply. But AI engineering, RAG architecture, and modernization sequencing require different expertise — one we bring alongside your team, not instead of it.",
  },
  {
    title: "Organizational Resistance",
    body: "Even with leadership support, fear of destabilizing the product or losing control can stall progress. We reduce resistance with clarity, evidence, and incremental wins.",
  },
  {
    title: "Compliance & Ethics",
    body: "The EU AI Act introduces real obligations — transparency, risk classification, data governance, human oversight. We build alignment into the roadmap from day one.",
  },
];

export default function CoreBarriersPage() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Core Barriers to Modernization</h1>

        <div className="mt-4 flex justify-center lg:absolute lg:left-[-9rem] lg:top-1/2 lg:z-[60] lg:mt-0 lg:-translate-y-1/2">
          <HeroAvatarVideo videoSrc="/Core_Barriers.mp4" />
        </div>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;The four barriers are real — but they are not unbreakable.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:justify-center lg:gap-20">
          <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
            Modernizing a legacy software product is not simply a technical challenge —
            it is a multidimensional transformation that touches architecture,
            operations, customer expectations, and organizational psychology. Most
            vendors do not fail to modernize because they lack ambition — they face
            four systemic barriers that make modernization feel risky, overwhelming,
            or unclear. These barriers are universal across industries, architectures,
            and product types. They are the reason modernization stalls — and the
            reason a structured partner is essential.
          </p>
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
            <p className="mt-2 font-body text-sm text-charcoal">
              {barrier.title === "Compliance & Ethics" ? (
                <>
                  The{" "}
                  <Link href="/eu-ai-act-compliance" className="underline hover:text-electric-blue">
                    EU AI Act
                  </Link>{" "}
                  introduces real obligations — transparency, risk classification, data
                  governance, human oversight. We build alignment into the roadmap from
                  day one.
                </>
              ) : (
                barrier.body
              )}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
