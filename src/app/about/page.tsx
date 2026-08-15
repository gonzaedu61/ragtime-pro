import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ExternalLinkIcon from "@/components/ExternalLinkIcon";
import HeroAvatarVideo from "@/components/HeroAvatarVideo";
import ChatBannerTrigger from "@/components/chat/ChatBannerTrigger";

export const metadata: Metadata = {
  title: "About Ragtime-Pro | Ragtime-Pro",
  description:
    "Ragtime-Pro is a modernization partner for legacy software vendors — an AI-augmented Modernization Agent, the Product Modernization Triad, expert consultants, and AI Upgrade Modules.",
};

const SECTIONS = [
  {
    title: "Our Modernization Agent",
    body: "Our proprietary AI engine ingests your product's source code, workflows, documentation, and business context to produce actionable modernization intelligence.",
    href: "/modernization-agent",
  },
  {
    title: "The Product Modernization Triad",
    body: "The strategic framework that aligns Boost Point, Opportunity, and Readiness — dynamically adapted to your product's industry, architecture, and regulatory environment.",
    href: "/methodology",
  },
  {
    title: "The Consulting Layer",
    body: "Our expert consultants interpret the Agent's analysis, validate it with your team, and execute modernization safely and collaboratively.",
    href: "/methodology/process",
  },
  {
    title: "AI Upgrade Modules",
    body: "The tangible deliverables — Productivity Features, Workflow Automations, RAG Assistants, Reasoning Agents, and Custom Models — integrated directly into your product.",
    href: "/solutions",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">About Ragtime-Pro</h1>

        <div className="mt-4 flex justify-center lg:absolute lg:left-[-9rem] lg:top-1/2 lg:z-[60] lg:mt-0 lg:-translate-y-1/2">
          <HeroAvatarVideo videoSrc="/About_Us.mp4" />
        </div>
      </section>

      <section className="relative bg-navy py-8">
        <ChatBannerTrigger />
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;We are not a generic AI consultancy. We are a modernization partner.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8">
        <div className="flex flex-col items-center gap-12 text-center lg:flex-row lg:justify-center lg:gap-20">
          <p className="text-left font-body text-lg text-charcoal lg:max-w-2xl">
            Ragtime-Pro is a modernization partner for European software vendors who carry the weight —
            and the value — of legacy products. We specialize in transforming long-standing,
            mission-critical software into modern, intelligent, competitive products, without
            rewrites, risky migrations, or disruptive architectural changes. We combine
            AI-augmented analysis, a structured modernization methodology, expert consulting
            execution, and incremental, safe AI Upgrade Modules into a single modernization
            system.
          </p>
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
        {SECTIONS.map((section) =>
          section.href ? (
            <Link
              key={section.title}
              href={section.href}
              className="group relative block rounded-lg border border-transparent bg-light-grey p-6 pb-10 transition-all hover:-translate-y-1 hover:border-electric-blue hover:shadow-md"
            >
              <h2 className="font-heading text-lg font-semibold text-navy transition-colors group-hover:text-electric-blue">
                {section.title}
              </h2>
              <p className="mt-2 font-body text-sm text-charcoal">{section.body}</p>
              <ExternalLinkIcon className="absolute bottom-4 right-4 h-5 w-5 text-charcoal/40 transition-colors group-hover:text-electric-blue" />
            </Link>
          ) : (
            <div key={section.title} className="rounded-lg bg-light-grey p-6">
              <h2 className="font-heading text-lg font-semibold text-navy">{section.title}</h2>
              <p className="mt-2 font-body text-sm text-charcoal">{section.body}</p>
            </div>
          )
        )}
      </section>
    </>
  );
}
