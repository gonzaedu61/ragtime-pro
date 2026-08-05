import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";

export const metadata: Metadata = {
  title: "About The BrokerAI | The BrokerAI",
  description:
    "A vendor-neutral, European network of AI experts helping SMEs adopt AI safely — with deep EU AI Act regulatory expertise.",
};

const SECTIONS = [
  {
    title: "Mission",
    body: "Our mission is to give European SMEs a clear, safe, and structured path into AI adoption — without the confusion, hype, or vendor bias that often surrounds it.",
  },
  {
    title: "Skills Network",
    body: "We draw on a multi-disciplinary network of AI experts across Europe, bringing the right specialist to the right problem — not a one-size-fits-all team.",
  },
  {
    title: "Vendor-Neutral",
    body: "We have no allegiance to any platform or vendor. Our recommendations are judged purely on fit for your business.",
  },
  {
    title: "Regulatory Expertise",
    body: "Deep familiarity with the EU AI Act and evolving compliance requirements means your roadmap is safe by design, not by accident.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">About The BrokerAI</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;We are not a vendor. We are a strategic partner.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:justify-center lg:gap-20">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
            <div className="lg:self-start">
              <RoadmapVideoButton
                src="/We_Can_Help.mp4"
                ariaLabel="Play the We Can Help video"
                iconClassName="h-9 w-auto"
              />
            </div>
            <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
              Organizations don&apos;t struggle with AI because the technology is too complex — they
              struggle because the journey is unclear. The BrokerAI is a European
              multi-disciplinary network of technical specialists, organizational strategists,
              and regulatory advisors, brought together because AI adoption is a business
              challenge, a people challenge, and a governance challenge all at once. We hold no
              allegiance to any platform or vendor: every recommendation is judged purely on fit for your
              business.
            </p>
          </div>
          <Link href="/contact" className="group flex flex-col items-center gap-4">
            <Image
              src="/mail_icon.svg"
              alt="Mail icon"
              width={149}
              height={149}
              className="h-24 w-auto"
            />
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Contact us …
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pt-8 pb-16 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <div key={section.title} className="rounded-lg bg-light-grey p-6">
            <h2 className="font-heading text-lg font-semibold text-navy">{section.title}</h2>
            <p className="mt-2 font-body text-sm text-charcoal">{section.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
