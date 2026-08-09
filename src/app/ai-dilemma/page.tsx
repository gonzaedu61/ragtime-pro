import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";

export const metadata: Metadata = {
  title: "The Modernization Dilemma | Ragtime-Pro",
  description:
    "The product still works — but the market has moved. Why legacy software vendors hesitate to modernize, and what actually gets in the way.",
};

const SECTIONS = [
  {
    title: "Legacy at a Crossroads",
    body: "AI-native competitors ship modern experiences faster, customers expect automation and personalization, and integration standards keep evolving. The product still works — but the market has moved.",
  },
  {
    title: "Experimentation Without Strategy",
    body: "A chatbot pilot here, a workflow script there — isolated experiments rarely scale, because they're disconnected from your architecture, your customers, and your long-term roadmap.",
  },
  {
    title: "Mounting Pressure",
    body: "Competitors are moving, customers expect more, internal teams are already stretched thin, and regulators — especially under the EU AI Act — are raising the bar.",
  },
  {
    title: "The Paradox of Reliability",
    body: "Legacy products succeed because they're reliable — and hesitate to evolve for the same reason. Vendors don't lack vision. They lack clarity.",
  },
];

export default function AiDilemmaPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">The AI Modernization Dilemma</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;The product still works — but the market has moved.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:justify-center lg:gap-20">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
            <div className="lg:self-start">
              <RoadmapVideoButton
                src="/The_AI_Dilema.mp4"
                ariaLabel="Play the AI Dilemma video"
                iconClassName="h-9 w-auto"
              />
            </div>
            <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
              Thousands of European software vendors rely on products built years —
              sometimes decades — ago: stable, trusted, and deeply embedded in customer
              operations. But the market around them has changed. AI-native competitors
              move faster, customers expect modern experiences, and regulatory pressure
              keeps increasing. Legacy products are not failing — but they risk falling
              behind. AI itself is ready: RAG, workflow automation, reasoning agents, and
              custom models are all accessible today. What is not yet clear is the path —
              where to begin, what is safe to modernize first, and how to integrate AI
              into an architecture built over years without breaking what already works.
            </p>
          </div>
          <Link
            href="/ai-dilemma/barriers"
            className="group flex flex-col items-center gap-4"
          >
            <Image
              src="/barriers.svg"
              alt="Core barriers icon"
              width={1000}
              height={1067}
              className="h-32 w-auto"
            />
            <span className="-translate-x-2 whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Know the barriers …
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <div key={section.title} className="rounded-lg bg-light-grey p-6">
            <h2 className="font-heading text-lg font-semibold text-navy">{section.title}</h2>
            <p className="mt-2 font-body text-sm text-charcoal">
              {section.title === "Mounting Pressure" ? (
                <>
                  Competitors are moving, customers expect more, internal teams are
                  already stretched thin, and regulators — especially under the{" "}
                  <Link href="/eu-ai-act-compliance" className="underline hover:text-electric-blue">
                    EU AI Act
                  </Link>{" "}
                  — are raising the bar.
                </>
              ) : (
                section.body
              )}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
