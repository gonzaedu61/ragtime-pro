import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SolutionDetail from "@/components/SolutionDetail";
import { SOLUTIONS, getSolutionBySlug } from "@/lib/solutions";

export function generateStaticParams() {
  return SOLUTIONS.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    return {};
  }

  return {
    title: `${solution.title} | The BrokerAI`,
    description: solution.definition,
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  return <SolutionDetail solution={solution} />;
}
