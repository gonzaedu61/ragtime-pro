import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HeroAvatarVideo from "@/components/HeroAvatarVideo";

export const metadata: Metadata = {
  title: "EU AI Act Compliance | Ragtime-Pro",
  description:
    "How the EU AI Act's four risk tiers, transparency, data governance, human oversight, and lifecycle-monitoring obligations apply to AI-modernized legacy software — and how Ragtime-Pro builds compliance into every roadmap.",
};

const OBLIGATIONS = [
  {
    title: "Risk Classification",
    body: "The Act sorts every AI system into one of four tiers — unacceptable, high-risk, limited-risk, or minimal-risk. We classify each AI Upgrade Module correctly before it ships, so you meet only the obligations that actually apply.",
  },
  {
    title: "Transparency",
    body: "Limited-risk systems — including RAG assistants and Reasoning Agents — must clearly disclose that users are interacting with AI. We build this disclosure into the interface, not as a disclaimer bolted on afterward.",
  },
  {
    title: "Data Governance",
    body: "The Act sets expectations for the quality, provenance, and handling of data used to train or run AI systems. We audit your data sources before any RAG or Custom Model integration begins.",
  },
  {
    title: "Human Oversight",
    body: "High-risk AI systems require meaningful human oversight of automated decisions. We define where a human must stay in the loop, and where automation can safely run unattended.",
  },
  {
    title: "Auditability & Documentation",
    body: "High-risk systems must maintain technical documentation, logging, and traceability sufficient for regulators to reconstruct how a decision was made. We build this record-keeping into the module itself.",
  },
  {
    title: "Lifecycle Monitoring",
    body: "Compliance doesn't end at launch. High-risk systems require post-market monitoring as your product — and its data — evolve. Our Modernization Agent keeps watch as part of its ongoing analysis.",
  },
];

export default function EuAiActCompliancePage() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">EU AI Act Compliance</h1>

        <div className="mt-4 flex justify-center lg:absolute lg:left-[-9rem] lg:top-1/2 lg:z-[60] lg:mt-0 lg:-translate-y-1/2">
          <HeroAvatarVideo videoSrc="/EU_Compliance.mp4" />
        </div>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;Compliance built into the roadmap — not bolted on after launch.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:justify-center lg:gap-20">
          <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
            The EU AI Act is now in force, and it does not exempt software vendors who
            integrate AI into an existing product. Every AI Upgrade Module we implement is
            classified against the Act&apos;s four risk tiers — unacceptable, high-risk,
            limited-risk, and minimal-risk — and engineered to meet the obligations that
            tier requires, from disclosure to documentation. Prohibited practices have
            applied since February 2025, and high-risk obligations become fully
            enforceable in August 2026, with penalties reaching €35M or 7% of global
            turnover. We treat these deadlines as a design constraint, not a legal
            afterthought, so your modernization roadmap stays compliant from day one.
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

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {OBLIGATIONS.map((item) => (
          <div key={item.title} className="rounded-lg bg-light-grey p-6">
            <h2 className="font-heading text-lg font-semibold text-navy">{item.title}</h2>
            <p className="mt-2 font-body text-sm text-charcoal">
              {item.title === "Lifecycle Monitoring" ? (
                <>
                  Compliance doesn&apos;t end at launch. High-risk systems require
                  post-market monitoring as your product — and its data — evolve. Our{" "}
                  <Link href="/modernization-agent" className="underline hover:text-electric-blue">
                    Modernization Agent
                  </Link>{" "}
                  keeps watch as part of its ongoing analysis.
                </>
              ) : (
                item.body
              )}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
