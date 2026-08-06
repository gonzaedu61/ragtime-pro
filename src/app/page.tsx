import Image from "next/image";
import Link from "next/link";
import ExternalLinkIcon from "@/components/ExternalLinkIcon";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";
import RotatingHeadline from "@/components/RotatingHeadline";

const VALUE_BLOCKS = [
  {
    title: "We Bring Clarity",
    description:
      "Cut through the noise of tools, vendors, and hype with a clear, structured path forward.",
    href: "/ai-dilemma",
  },
  {
    title: "Structured Roadmaps",
    description:
      "Replace scattered experiments with a deliberate, sequenced plan tied to real business value. No random pilots.",
    href: "/methodology",
  },
  {
    title: "Vendor-Neutral Guidance",
    description:
      "We represent your interests, not a platform's — every recommendation is judged on fit, not commission.",
    href: "/about",
  },
  {
    title: "EU Compliance Support",
    description:
      "Adopt AI with confidence, backed by regulatory-aware guidance built for European SMEs.",
    href: "/eu-ai-act-compliance",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 pt-10 pb-20 text-center lg:flex-row lg:text-left">
        <div className="flex-1">
          <RotatingHeadline />
          <p className="mt-6 font-body text-lg text-charcoal">
            A safe, structured, and high-impact approach to AI adoption for European SMEs.
          </p>
          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/contact" className="group flex flex-col items-center gap-3">
              <span className="rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
                Book an Intro Call
              </span>
              <Image
                src="/discovery_call.svg"
                alt=""
                width={124}
                height={132}
                className="h-12 w-auto"
              />
            </Link>
            <RoadmapVideoButton
              label="Watch the AI-Roadmap-Guide video"
              lowBandwidthSrc="/AI_Roadmap_Guide_lowbandwidth.mp4"
              ariaLabel="Play the AI Roadmap Guide video"
              blueHoverIcon={false}
            />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Link
            href="/about"
            className="inline-block [perspective:1000px] transition-transform duration-300 hover:scale-105"
          >
            <div className="relative h-[169px] w-[350px] animate-[spin-3d_10s_linear_infinite] [transform-style:preserve-3d]">
              <Image
                src="/Ragtime-Pro_Logo.png"
                alt="Ragtime-Pro logo — syncopated rhythm bars symbolizing structured AI modernization"
                width={350}
                height={169}
                priority
                className="absolute inset-0 [backface-visibility:hidden]"
              />
              <Image
                src="/Ragtime-Pro_Logo.png"
                alt=""
                aria-hidden="true"
                width={350}
                height={169}
                className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
              />
            </div>
          </Link>
        </div>
      </section>

      <section className="bg-light-grey">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:grid-cols-2">
          {VALUE_BLOCKS.map((block) => (
            <Link
              key={block.title}
              href={block.href}
              className="group relative block rounded-lg border border-transparent bg-white p-6 pb-10 shadow-sm transition-all hover:-translate-y-1 hover:border-electric-blue hover:shadow-md"
            >
              <h2 className="font-heading text-lg font-semibold text-navy transition-colors group-hover:text-electric-blue">
                {block.title}
              </h2>
              <p className="mt-2 font-body text-sm text-charcoal">{block.description}</p>
              <ExternalLinkIcon className="absolute bottom-4 right-4 h-5 w-5 text-charcoal/40 transition-colors group-hover:text-electric-blue" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
