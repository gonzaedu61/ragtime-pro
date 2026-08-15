import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HeroAvatarVideo from "@/components/HeroAvatarVideo";
import ChatBannerTrigger from "@/components/chat/ChatBannerTrigger";

export const metadata: Metadata = {
  title: "The Modernization Agent | Ragtime-Pro",
  description:
    "Ragtime-Pro's proprietary AI system — the internal intelligence engine behind every modernization engagement.",
};

const STEPS = [
  {
    title: "Maps the Full Picture",
    body: "Maps your product's architecture and understands its workflows and data flows, end to end.",
  },
  {
    title: "Detects Boost Points",
    body: "Identifies the modernization hotspots where AI can create the highest value with minimal disruption.",
  },
  {
    title: "Classifies the Right Module",
    body: "Matches each Boost Point to one of the 5 AI Upgrade Module categories and drafts its specification.",
  },
  {
    title: "Adapts to Your Industry",
    body: "Tunes the Product Modernization Triad to your product's specific industry and constraints.",
  },
  {
    title: "Produces the Blueprint",
    body: "Generates the modernization blueprint and suggests safe integration patterns for your architecture.",
  },
  {
    title: "Code AI Upgrade Modules",
    body: "Generates the required code to adapt and integrate existing standard Ragtime-Pro AI Modules or develop ad-hoc ones if required.",
  },
  {
    title: "Ensures Safe Execution",
    body: "Ensures compliance alignment and supports our consultants throughout execution.",
  },
];

export default function EngagementModelPage() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Modernization Agent</h1>

        <div className="mt-4 flex justify-center lg:absolute lg:left-[-9rem] lg:top-1/2 lg:z-[60] lg:mt-0 lg:-translate-y-1/2">
          <HeroAvatarVideo videoSrc="/Modernization_Agent.mp4" />
        </div>
      </section>

      <section className="relative bg-navy py-8">
        <ChatBannerTrigger />
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;The engine behind our modernization service.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-center lg:gap-16">
          <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
            The Modernization Agent is Ragtime-Pro&apos;s proprietary AI system — not a
            customer-facing tool, but the internal intelligence engine behind every
            modernization engagement. It ingests your product&apos;s entire context:
            source code in any language or architecture, user manuals, technical
            specifications, actual and intended workflows, business processes, industry
            constraints, regulatory context, and the competitive landscape. The output is
            actionable modernization intelligence, showing exactly how legacy systems can
            be enhanced, extended, or transformed.
          </p>
          <Link href="/methodology" className="group flex flex-col items-center gap-4">
            <Image
              src="/roadmap.svg"
              alt="Roadmap icon"
              width={198}
              height={263}
              className="h-32 w-auto"
            />
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              See Our Methodology …
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className={`rounded-lg bg-light-grey p-6 ${
                index === STEPS.length - 1
                  ? "sm:col-span-2 lg:col-span-3 lg:mx-auto lg:w-[calc(((100%-3rem)/3)*2)]"
                  : ""
              }`}
            >
              <h2 className="font-heading text-lg font-semibold text-navy">{step.title}</h2>
              <p className="mt-2 font-body text-sm text-charcoal">
                {step.title === "Classifies the Right Module" ? (
                  <>
                    Matches each{" "}
                    <Link href="/methodology/boost-point" className="underline hover:text-electric-blue">
                      Boost Point
                    </Link>{" "}
                    to one of the 5 AI Upgrade Module categories and drafts its
                    specification.
                  </>
                ) : step.title === "Adapts to Your Industry" ? (
                  <>
                    Tunes the{" "}
                    <Link href="/methodology" className="underline hover:text-electric-blue">
                      Product Modernization Triad
                    </Link>{" "}
                    to your product&apos;s specific industry and constraints.
                  </>
                ) : step.title === "Code AI Upgrade Modules" ? (
                  <>
                    Generates the required code to adapt and integrate existing standard
                    Ragtime-Pro{" "}
                    <Link href="/solutions" className="underline hover:text-electric-blue">
                      AI Modules
                    </Link>{" "}
                    or develop ad-hoc ones if required.
                  </>
                ) : (
                  step.body
                )}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
