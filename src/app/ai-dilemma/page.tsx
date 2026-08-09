import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";

export const metadata: Metadata = {
  title: "The AI Dilemma | The BrokerAI",
  description:
    "Why SME AI adoption stalls: accessible tools, unclear outcomes, and the pressure from competitors, vendors, and regulators.",
};

const SECTIONS = [
  {
    title: "Accessible, but unclear",
    body: "Tools are cheaper and easier to access than ever. What's missing isn't access — it's a clear sense of where to start and what actually matters for your business.",
  },
  {
    title: "Experimentations without value",
    body: "Most SMEs have already tried something — a chatbot, a pilot, an automation script. Few have turned that experimentation into measurable business value.",
  },
  {
    title: "Feeling the pressure",
    body: "Competitors are moving, vendors are pitching, and regulators — especially under the EU AI Act — are raising the bar. Standing still carries its own risk.",
  },
  {
    title: "Stuck in a paradox",
    body: "Interest in AI has never been higher, yet clarity on how to adopt it safely and effectively remains rare. That gap is where most SMEs get stuck.",
  },
];

export default function AiDilemmaPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">The AI Dilemma</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;AI adoption is not a choice — but the path forward feels risky and
            uncertain.&rdquo;
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
              AI adoption for SMEs is full of interest and full of noise — rarely full of
              clarity. AI has never been more accessible — cloud tools deploy in minutes, and
              low-code platforms let non-technical teams automate real work. Yet most SMEs still
              hesitate. They see competitors experimenting, vendors pitching, and regulators
              raising the bar, but the path forward stays unclear. More than 75% have already
              tried something — a chatbot, a summarizer, a pilot — without turning that
              experimentation into lasting value. The potential is there — it just needs
              direction.
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
              {section.title === "Feeling the pressure" ? (
                <>
                  Competitors are moving, vendors are pitching, and regulators — especially
                  under the{" "}
                  <Link href="/eu-ai-act-compliance" className="underline hover:text-electric-blue">
                    EU AI Act
                  </Link>{" "}
                  — are raising the bar. Standing still carries its own risk.
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
