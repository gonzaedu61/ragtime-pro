import type { Metadata } from "next";
import Link from "next/link";
import AlmendroChatWidget from "@/components/almendro/AlmendroChatWidget";

export const metadata: Metadata = {
  title: "ALMENDRO Manual Assistant | RAGnify",
  description:
    "A live RAG demo grounded in the real German-language user manuals for ALMENDRO, a legacy ERP system - ask it anything about the product, in any language.",
};

export default function AlmendroDemoPage() {
  return (
    <>
      <section className="relative mx-auto max-w-7xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">ALMENDRO Manual Assistant</h1>
      </section>

      <section className="relative bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;Users no longer search for answers — the product provides them.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-16 text-center">
        <p className="font-body text-lg text-charcoal">
          ALMENDRO is a real legacy ERP system for manufacturing and order management, documented across
          38 German-language user manuals covering everything from order processing to warehouse
          logistics and payroll. Rather than describe RAG Solutions in the abstract, this page runs one:
          the assistant below is grounded entirely in those manuals — retrieval, reranking, and citations
          included — with no connection to RAGnify&apos;s own site content or the rest of this website&apos;s chat.
        </p>
        <p className="mt-4 font-body text-base text-charcoal/70">
          Ask it in English, German, or any language you like — it detects and replies in kind, and every
          answer links back to the exact manual page it came from.
        </p>

        <div className="mt-8 flex justify-center">
          <AlmendroChatWidget />
        </div>

        <p className="mt-8">
          <Link href="/solutions/rag-solutions" className="font-body text-sm text-electric-blue underline hover:text-navy">
            ← Back to RAG Solutions
          </Link>
        </p>
      </section>
    </>
  );
}
