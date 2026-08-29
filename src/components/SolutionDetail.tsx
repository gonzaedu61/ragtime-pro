import Image from "next/image";
import Link from "next/link";
import HeroAvatarVideo from "@/components/HeroAvatarVideo";
import RoadmapVideoButton from "@/components/RoadmapVideoButton";
import ChatBannerTrigger from "@/components/chat/ChatBannerTrigger";
import { SOLUTIONS, type SolutionClass } from "@/lib/solutions";

const SIDEBAR_ICON_SIZES: Record<string, string> = {
  "personal-productivity": "h-14 w-9",
  "reasoning-agents": "h-[4.5rem] w-[2.75rem]",
};
const DEFAULT_SIDEBAR_ICON_SIZE = "h-16 w-10";

export default function SolutionDetail({ solution }: { solution: SolutionClass }) {
  const otherSolutions = SOLUTIONS.filter((s) => s.slug !== solution.slug);

  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">{solution.title}</h1>

        {solution.heroAvatarEnabled && solution.video && (
          <div className="mt-4 flex justify-center lg:absolute lg:left-[-9rem] lg:top-1/2 lg:z-[60] lg:mt-0 lg:-translate-y-1/2">
            <HeroAvatarVideo videoSrc={solution.video} imageSrc={solution.heroAvatarImage} />
          </div>
        )}
      </section>

      <section className="relative bg-navy py-8">
        <ChatBannerTrigger />
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;{solution.quote}&rdquo;
          </p>
        </div>
      </section>

      <section className="pb-16 min-[1440px]:grid min-[1440px]:grid-cols-[calc(50%-30rem)_1fr_calc(50%-30rem)]">
        <div className="mx-auto max-w-5xl px-6 pt-8 pb-8 min-[1440px]:col-start-2 min-[1440px]:row-start-1 min-[1440px]:h-72 min-[1440px]:overflow-hidden">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
              {solution.video && !solution.heroAvatarEnabled && (
                <div className="shrink-0">
                  <RoadmapVideoButton
                    src={solution.video}
                    ariaLabel={`Play the ${solution.title} video`}
                    iconClassName="h-9 w-auto"
                  />
                </div>
              )}
              <p className="font-body text-lg text-charcoal">{solution.overview}</p>
            </div>
            {solution.icon && (
              <Image
                src={solution.icon}
                alt={`${solution.title} icon`}
                width={164}
                height={268}
                className="h-24 w-auto shrink-0"
              />
            )}
          </div>
        </div>

        <nav className="mx-auto mb-10 max-w-4xl px-6 min-[1440px]:col-start-1 min-[1440px]:row-start-2 min-[1440px]:mb-0 min-[1440px]:flex min-[1440px]:items-start min-[1440px]:justify-center min-[1440px]:px-0">
          <div className="mx-auto flex w-fit flex-col items-start gap-0 min-[1440px]:mx-0 min-[1440px]:w-auto">
            {otherSolutions.map((other) => (
              <Link
                key={other.slug}
                href={`/solutions/${other.slug}`}
                className="group flex items-center gap-4 rounded-lg px-3 py-1"
              >
                {other.icon && (
                  <span
                    className={`relative block shrink-0 transition-transform duration-150 group-hover:scale-110 ${SIDEBAR_ICON_SIZES[other.slug] ?? DEFAULT_SIDEBAR_ICON_SIZE}`}
                  >
                    <Image
                      src={other.icon}
                      alt={`${other.title} icon`}
                      width={164}
                      height={268}
                      className="absolute inset-0 h-full w-full object-contain transition-opacity duration-150 group-hover:opacity-0"
                    />
                    {other.iconHover && (
                      <Image
                        src={other.iconHover}
                        alt=""
                        width={164}
                        height={268}
                        className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                      />
                    )}
                  </span>
                )}
                <span className="origin-left font-body text-lg font-medium text-navy transition-all duration-150 group-hover:scale-110 group-hover:text-electric-blue">
                  {other.title}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-2 min-[1440px]:col-start-2 min-[1440px]:row-start-2">
          <div className="rounded-lg bg-light-grey p-6">
            <h2 className="font-heading text-lg font-semibold text-navy">Value</h2>
            <p className="mt-2 font-body text-sm text-charcoal">{solution.smeValue}</p>
          </div>

          <div className="rounded-lg bg-light-grey p-6">
            <h2 className="font-heading text-lg font-semibold text-navy">Examples</h2>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {solution.examples.map((example) => (
                <li key={example} className="font-body text-sm text-charcoal">
                  {example}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-light-grey p-6">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Readiness Requirements
            </h2>
            <p className="mt-2 font-body text-sm text-charcoal">
              {solution.readinessRequirements}
            </p>
          </div>

          <div className="rounded-lg bg-light-grey p-6">
            <h2 className="font-heading text-lg font-semibold text-navy">
              Roadmap Fit
            </h2>
            <p className="mt-2 font-body text-sm text-charcoal">{solution.roadmapFit}</p>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center gap-8 px-6 min-[1440px]:col-start-3 min-[1440px]:row-start-2 min-[1440px]:mt-0 min-[1440px]:px-0 min-[1440px]:pt-10">
          <Link href="/methodology" className="group flex flex-col items-center gap-4">
            <Image
              src="/roadmap.svg"
              alt="Roadmap icon"
              width={198}
              height={263}
              className="h-32 w-auto"
            />
            <span className="whitespace-nowrap rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors group-hover:bg-electric-blue">
              Setting the roadmap ...
            </span>
          </Link>

          {solution.demoHref && (
            <Link
              href={solution.demoHref}
              className="whitespace-nowrap rounded-md border border-electric-blue px-6 py-3 font-body text-sm font-semibold text-electric-blue transition-colors hover:bg-electric-blue hover:text-white"
            >
              {solution.demoLabel ?? "Try a live demo →"}
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
