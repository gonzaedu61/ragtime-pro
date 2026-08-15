import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HeroAvatarVideo from "@/components/HeroAvatarVideo";
import ChatBannerTrigger from "@/components/chat/ChatBannerTrigger";

export const metadata: Metadata = {
  title: "Start Your Journey | Ragtime-Pro",
  description:
    "Engagement with Ragtime-Pro begins with a conversation, not a proposal — three phases from a free introductory consultation to an ongoing modernization partnership.",
};

const PHASES = [
  {
    title: "Our First Talk",
    body: "A conversation where we understand your product, your goals, and your constraints, and explain our methodology, the Modernization Agent, and the AI Upgrade Modules. No commitments, no pressure — just clarity.",
  },
  {
    title: "Modernization Assessment",
    body: "A structured assessment supported by the Modernization Agent: architecture mapping, Boost Point detection, Triad alignment, and compliance considerations, producing a Modernization Assessment Report that becomes the foundation for your strategy.",
  },
  {
    title: "Modernization Partnership",
    body: "Once the roadmap is validated, we deliver modernization through incremental AI Upgrade Modules, guided integration, and continuous sequencing. We modernize with you — not for you.",
  },
];

export default function StartPage() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Start Your Journey</h1>

        <div className="mt-4 flex justify-center lg:absolute lg:left-[-9rem] lg:top-1/2 lg:z-[60] lg:mt-0 lg:-translate-y-1/2">
          <HeroAvatarVideo videoSrc="/Start_Journey.mp4" />
        </div>
      </section>

      <section className="relative bg-navy py-8">
        <ChatBannerTrigger />
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;One conversation can change how you see your product&apos;s
            future.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:justify-center lg:gap-16">
          <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
            Legacy modernization is not a transaction — it is a partnership. Every
            product has its own history, architecture, constraints, and ambitions, so
            engagement with{" "}
            <Link href="/about" className="underline hover:text-electric-blue">
              Ragtime-Pro
            </Link>{" "}
            begins not with a proposal, but with a conversation: one where we listen,
            understand, and map your modernization reality. From that first
            interaction, our goal is simple — give you clarity, give you structure,
            give you confidence.
          </p>
          <Link href="/contact" className="group flex flex-col items-center gap-3">
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Request a Modernization Consultation
            </span>
            <Image
              src="/discovery_call.svg"
              alt=""
              width={124}
              height={132}
              className="h-12 w-auto"
            />
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 sm:grid-cols-3">
        {PHASES.map((phase) => (
          <div key={phase.title} className="rounded-lg bg-light-grey p-6">
            <h2 className="font-heading text-lg font-semibold text-navy">{phase.title}</h2>
            <p className="mt-2 font-body text-sm text-charcoal">
              {phase.title === "Our First Talk" ? (
                <>
                  A conversation where we understand your product, your goals, and your
                  constraints, and explain{" "}
                  <Link href="/methodology" className="underline hover:text-electric-blue">
                    our methodology
                  </Link>
                  , the{" "}
                  <Link href="/modernization-agent" className="underline hover:text-electric-blue">
                    Modernization Agent
                  </Link>
                  , and the{" "}
                  <Link href="/solutions" className="underline hover:text-electric-blue">
                    AI Upgrade Modules
                  </Link>
                  . No commitments, no pressure — just clarity.
                </>
              ) : phase.title === "Modernization Assessment" ? (
                <>
                  A structured assessment supported by the Modernization Agent:
                  architecture mapping,{" "}
                  <Link href="/methodology/boost-point" className="underline hover:text-electric-blue">
                    Boost Point
                  </Link>{" "}
                  detection, Triad alignment, and{" "}
                  <Link href="/eu-ai-act-compliance" className="underline hover:text-electric-blue">
                    compliance considerations
                  </Link>
                  , producing a Modernization Assessment Report that becomes the
                  foundation for your strategy.
                </>
              ) : (
                phase.body
              )}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
