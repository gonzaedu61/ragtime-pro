import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU AI Act Compliance | The BrokerAI",
  description:
    "What the EU AI Act requires of SMEs adopting AI — risk classification, transparency, data governance, and human oversight — and how The BrokerAI builds compliance into every roadmap.",
};

const OBLIGATIONS = [
  {
    title: "Risk Classification",
    body: "The Act classifies AI systems by risk level, from minimal to high-risk. Knowing where your use case falls determines exactly which obligations apply — and prevents both over- and under-engineering your compliance approach.",
  },
  {
    title: "Transparency",
    body: "Certain AI systems must clearly disclose that users are interacting with AI, and how automated outputs are generated. We build this into the roadmap from the outset, not as an afterthought.",
  },
  {
    title: "Data Governance",
    body: "The Act sets expectations for the quality, provenance, and handling of data used to train or run AI systems. Meeting them is also, simply, good practice.",
  },
  {
    title: "Human Oversight",
    body: "Higher-risk AI systems require meaningful human oversight of automated decisions. We help define where a human must stay in the loop, and where automation can safely run unattended.",
  },
];

export default function EuAiActCompliancePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">EU AI Act Compliance</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;Turning AI compliance obligations into a manageable, structured
            process.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:justify-center lg:gap-20">
          <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
            Regulatory-aware guidance built into every roadmap — not bolted on at the end. The EU
            AI Act introduces real obligations — but for most SMEs, the actual impact is far more
            manageable than it first appears. The fear of non-compliance, fines, or reputational
            damage often adds more hesitation than the regulation itself warrants. Every roadmap
            we design accounts for these requirements from the outset, turning compliance from a
            source of anxiety into a structured, manageable part of adoption.
          </p>
          <Link href="/about" className="group flex flex-col items-center gap-4">
            <Image
              src="/EU_compliance.svg"
              alt="EU compliance icon"
              width={2070}
              height={1771}
              className="h-32 w-auto"
            />
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              We can help you …
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 sm:grid-cols-2">
        {OBLIGATIONS.map((item) => (
          <div key={item.title} className="rounded-lg bg-light-grey p-6">
            <h2 className="font-heading text-lg font-semibold text-navy">{item.title}</h2>
            <p className="mt-2 font-body text-sm text-charcoal">{item.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
