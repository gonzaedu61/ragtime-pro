import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Value-Centered Layers | The BrokerAI",
  description:
    "How The BrokerAI's engagement model delivers impact across three layers: operational, strategic, and transformational value.",
};

const CARDS = [
  {
    title: "Operational",
    body: "Immediate efficiency gains and reduced manual effort in day-to-day work.",
    icon: "/operational_layer.svg",
  },
  {
    title: "Strategic",
    body: "AI capabilities aligned with broader business goals and competitive positioning.",
    icon: "/strategic_layer.svg",
  },
  {
    title: "Transformational",
    body: "Long-term structural change in how the organization operates and competes.",
    icon: "/transformational_layer.svg",
  },
];

export default function ValueCenteredLayersPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Value-Centered Layers</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white lg:whitespace-nowrap">
            &ldquo;ROI tracking at key value layers — from daily operations to long-term
            differentiation.&rdquo;
          </p>
        </div>
      </section>

      <div className="relative">
        <section className="mx-auto max-w-3xl px-6 pt-8 pb-12 text-center">
          <p className="font-body text-lg text-charcoal">
            The BrokerAI&apos;s value-centric engagement model delivers impact across three
            layers of your business. Operational value shows up first — reduced manual work,
            improved accuracy, and faster workflows that teams feel from day one. Strategic value
            follows as decision-making sharpens, institutional knowledge becomes accessible, and
            the organization grows more resilient and competitive. Over time, transformational
            value emerges — proprietary AI capabilities, automated complex processes, and new
            business models that position the SME for long-term differentiation.
          </p>
        </section>

        <section className="pb-16">
          <div className="mx-auto grid max-w-4xl gap-8 px-6 sm:grid-cols-3">
            {CARDS.map((card) => (
              <div key={card.title} className="rounded-lg bg-light-grey p-6 text-center">
                <h2 className="font-heading text-lg font-semibold text-navy">{card.title}</h2>
                <p className="mt-2 font-body text-sm text-charcoal">{card.body}</p>
                <div className="relative mx-auto mt-4 h-20 w-20">
                  <Image src={card.icon} alt="" fill className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto mb-10 flex max-w-4xl justify-center px-6 min-[1440px]:absolute min-[1440px]:inset-y-0 min-[1440px]:left-0 min-[1440px]:mb-0 min-[1440px]:w-[calc(50%-26.5rem)] min-[1440px]:items-center min-[1440px]:px-0">
          <Link href="/methodology" className="group flex flex-col items-center gap-4">
            <Image
              src="/roadmap.svg"
              alt="Roadmap icon"
              width={198}
              height={263}
              className="h-32 w-auto"
            />
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Setting the roadmap …
            </span>
          </Link>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl justify-center px-6 min-[1440px]:absolute min-[1440px]:inset-y-0 min-[1440px]:right-0 min-[1440px]:mt-0 min-[1440px]:w-[calc(50%-26.5rem)] min-[1440px]:items-center min-[1440px]:px-0">
          <Link href="/engagement-model" className="group flex flex-col items-center gap-4">
            <div className="flex h-32 items-end justify-center">
              <Image
                src="/steps.svg"
                alt="Steps icon"
                width={677}
                height={210}
                className="h-12 w-auto"
              />
            </div>
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Check the steps …
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
