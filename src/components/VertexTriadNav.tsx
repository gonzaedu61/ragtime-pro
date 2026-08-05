import Image from "next/image";
import Link from "next/link";

export type Vertex = "need" | "opportunity" | "readiness";

const VERTICES: { slug: Vertex; label: string; top: string; left: string }[] = [
  { slug: "need", label: "Need", top: "16.7%", left: "49.2%" },
  { slug: "readiness", label: "Readiness", top: "79.4%", left: "19%" },
  { slug: "opportunity", label: "Opportunity", top: "79.4%", left: "79.1%" },
];

export default function VertexTriadNav({ current }: { current: Vertex }) {
  return (
    <div className="w-80">
      <div className="relative">
        <Image
          src="/plain_triad.svg"
          alt="Driving-Triad diagram: Need, Opportunity, Readiness"
          width={1559}
          height={1399}
          className="h-auto w-full"
        />
        {VERTICES.map((vertex) => {
          const isCurrent = vertex.slug === current;

          return (
            <span
              key={vertex.slug}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: vertex.top, left: vertex.left }}
            >
              {isCurrent ? (
                <Image
                  src="/current_vertex.svg"
                  alt={`${vertex.label} (current)`}
                  width={42}
                  height={41}
                  className="h-7 w-7"
                />
              ) : (
                <Link
                  href={`/methodology/${vertex.slug}`}
                  className="group relative block h-5 w-5"
                >
                  <Image
                    src="/normal_vertex.svg"
                    alt={vertex.label}
                    width={91}
                    height={91}
                    className="absolute inset-0 h-full w-full object-contain transition-opacity duration-150 group-hover:opacity-0"
                  />
                  <Image
                    src="/hover_vertex.svg"
                    alt=""
                    width={224}
                    height={224}
                    className="absolute left-1/2 top-1/2 h-7 w-7 max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  />
                </Link>
              )}
            </span>
          );
        })}
      </div>
      <p className="mt-1 text-center font-body text-lg text-charcoal">
        Choose another vertex …
      </p>
    </div>
  );
}
