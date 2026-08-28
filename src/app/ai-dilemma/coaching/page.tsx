import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HeroAvatarVideo from "@/components/HeroAvatarVideo";
import ChatBannerTrigger from "@/components/chat/ChatBannerTrigger";

export const metadata: Metadata = {
  title: "Coaching: The AI-Augmented Barrier Breaker | RAGnify",
  description:
    "How AI-augmented coaching, powered by the Modernization Agent, demystifies modernization, bridges the skills gap, reduces resistance, and ensures EU AI Act compliance.",
};

const KEY_BLOCKS = [
  {
    title: "Demystification",
    body: "Legacy architectures are often undocumented and fragmented. The Modernization Agent analyzes them automatically, highlights risks and constraints, and explains integration options in plain language.",
  },
  {
    title: "Bridging the Skills Gap",
    body: "The Modernization Agent generates safe integration points for RAG, workflow, and reasoning capabilities, with technical explanations tailored to your team's skill level.",
  },
  {
    title: "Reducing Resistance",
    body: "Evidence-based modernization paths, risk-controlled integration plans, and early wins turn modernization from a threat into a guided evolution.",
  },
  {
    title: "Ensuring Compliance",
    body: "The Modernization Agent evaluates risk categories, transparency, data governance, and human oversight against the EU AI Act before any step proceeds.",
  },
  {
    title: "Building Confidence",
    body: "The result: a leadership team that understands its modernization roadmap and trusts the decisions behind it.",
  },
];

export default function CoachingPage() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">
          The AI-Augmented Barrier Breaker
        </h1>

        <div className="mt-4 flex justify-center lg:absolute lg:left-[-9rem] lg:top-1/2 lg:z-[60] lg:mt-0 lg:-translate-y-1/2">
          <HeroAvatarVideo videoSrc="/Barriers_Breaker.mp4" />
        </div>
      </section>

      <section className="relative bg-navy py-8">
        <ChatBannerTrigger />
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;Coaching becomes the engine breaking the barriers - amplified by AI
            itself.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:justify-center lg:gap-20">
          <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
            Modernizing a legacy software product traditionally depended entirely on
            human consultants. RAGnify&apos;s coaching is AI-augmented, powered by
            the{" "}
            <Link href="/modernization-agent" className="underline hover:text-electric-blue">
              Modernization Agent
            </Link>
            , which performs the heavy analytical work — scanning code, mapping
            dependencies, identifying{" "}
            <Link href="/methodology/boost-point" className="underline hover:text-electric-blue">
              Boost Points
            </Link>
            , evaluating integration paths, and assessing{" "}
            <Link href="/eu-ai-act-compliance" className="underline hover:text-electric-blue">
              EU AI Act
            </Link>{" "}
            implications. Your team brings product knowledge, our consultants bring
            modernization expertise, and the Modernization Agent brings analytical
            acceleration — together breaking every barrier.
          </p>
          <Link href="/about" className="group flex flex-col items-center gap-4">
            <Image
              src="/RAGnify_Logo.svg"
              alt="RAGnify logo"
              width={280}
              height={135}
              className="h-20 w-auto"
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
              <p className="mt-2 font-body text-sm text-charcoal">
                {block.title === "Ensuring Compliance" ? (
                  <>
                    The Modernization Agent evaluates risk categories, transparency,
                    data governance, and human oversight against the{" "}
                    <Link href="/eu-ai-act-compliance" className="underline hover:text-electric-blue">
                      EU AI Act
                    </Link>{" "}
                    before any step proceeds.
                  </>
                ) : (
                  block.body
                )}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
