import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";

export const metadata: Metadata = {
  title: "Start Your Journey | The BrokerAI",
  description:
    "The first step in any AI journey isn't a technology purchase — it's a conversation. Book a discovery call with The BrokerAI.",
};

export default function StartPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Start Your Journey</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;The first step in any AI journey should not be a technology purchase — it
            should be a conversation.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-24">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:items-center lg:justify-center lg:gap-20">
          <div className="flex flex-col items-center text-center lg:max-w-2xl lg:items-start lg:text-left">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
              <div className="shrink-0 lg:self-start">
                <RoadmapVideoButton
                  src="/Starting_The_Journey.mp4"
                  ariaLabel="Play the Starting Your Journey video"
                  iconClassName="h-9 w-auto"
                />
              </div>
              <p className="font-body text-lg text-charcoal">
                For many SME owners, starting an AI journey is both exciting and daunting — the
                benefits are clear, but questions about where to start, how much to invest, and how
                to avoid costly mistakes can make the path feel uncertain. At The BrokerAI, we
                believe meaningful transformation begins with understanding: your business, your
                workflows, your constraints, and your readiness — not with a product demo. Our
                approach is grounded in the Driving-Triad, so every recommendation aligns with your
                needs, opportunities, and readiness, and evolves with you as all three change.
                Above all, it&apos;s a partnership, not a vendor relationship — we stay with you
                through discovery, roadmap design, pilot selection, and scaling.
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-8 sm:flex-row">
              <Link
                href="/contact"
                className="group flex flex-col items-center gap-3"
              >
                <span className="rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
                  Book a Discovery Call
                </span>
                <Image
                  src="/discovery_call.svg"
                  alt=""
                  width={124}
                  height={132}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="flex flex-col items-center gap-3">
                <RoadmapVideoButton
                  label="Watch the full AI-Roadmap-Guide video"
                  lowBandwidthSrc="/AI_Roadmap_Guide_lowbandwidth.mp4"
                  ariaLabel="Play the AI Roadmap Guide video"
                  blueHoverIcon={false}
                />
              </div>
            </div>
          </div>
          <Image
            src="/journey_start.svg"
            alt="Starting the journey icon"
            width={822}
            height={677}
            className="h-48 w-auto"
          />
        </div>
      </section>
    </>
  );
}
