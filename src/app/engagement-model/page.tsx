import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";

export const metadata: Metadata = {
  title: "Engagement Model | The BrokerAI",
  description:
    "A six-step, value-centric engagement model — from structured discovery to continuous ROI tracking.",
};

const STEPS = [
  {
    title: "Structured Discovery",
    body: "We start by understanding your business, processes, and goals before any technology is discussed.",
    icon: "/step_1.svg",
  },
  {
    title: "Roadmap Blueprinting",
    body: "We translate discovery into a sequenced, prioritized AI roadmap tailored to your readiness and goals.",
    icon: "/step_2.svg",
  },
  {
    title: "Vendor Brokerage",
    body: "We identify and negotiate with the right vendors on your behalf — staying neutral throughout.",
    icon: "/step_3.svg",
  },
  {
    title: "Change Management",
    body: "We guide your team through adoption, reducing resistance and building lasting internal capability.",
    icon: "/step_4.svg",
  },
  {
    title: "Compliance Guidance",
    body: "We ensure every step of the roadmap aligns with EU AI Act and broader regulatory requirements.",
    icon: "/step_5.svg",
  },
  {
    title: "Continuous ROI Tracking",
    body: "We measure impact against the original business case, adjusting the roadmap as results come in.",
    icon: "/step_6.svg",
  },
];

export default function EngagementModelPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Engagement Model</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;Understanding the organization and evolving through continuous value
            delivery.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-center lg:gap-16">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
            <div className="lg:self-start">
              <RoadmapVideoButton
                src="/Engagement_Model.mp4"
                ariaLabel="Play the Engagement Model video"
                iconClassName="h-9 w-auto"
              />
            </div>
            <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
              Our value-centric engagement model is built on six steps, delivering impact across
              three layers of business value. Rather than treating AI as a technology
              experiment, we treat adoption as a structured transformation that begins with
              understanding the organization and evolving through continuous value delivery. It
              starts with structured discovery into your workflows and readiness, moves into
              roadmap blueprinting guided by the Driving-Triad, and continues through vendor
              brokerage, change management, and compliance guidance — all held together by a
              continuous feedback loop that tracks ROI and refines the roadmap as the needs,
              opportunities, and readiness evolve.
            </p>
          </div>
          <Link
            href="/engagement-model/value-centered-layers"
            className="group flex flex-col items-center gap-4"
          >
            <Image
              src="/value_layers.svg"
              alt="Value layers icon"
              width={822}
              height={1160}
              className="h-32 w-auto"
            />
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              See the business value layers …
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.title} className="rounded-lg bg-light-grey p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-24 shrink-0">
                  <Image
                    src={step.icon}
                    alt=""
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <h2 className="font-heading text-lg font-semibold text-navy">{step.title}</h2>
              </div>
              <p className="mt-2 font-body text-sm text-charcoal">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
