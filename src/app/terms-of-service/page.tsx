import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Ragtime-Pro",
  description: "The terms that govern your use of the Ragtime-Pro website and our AI-driven modernization services.",
};

const SECTIONS = [
  {
    title: "Acceptance of these terms",
    body: "By using this website, you agree to these terms. If you do not agree, please do not use the site. These terms apply to the website only; any consulting engagement with Ragtime-Pro is governed by a separate agreement signed between the parties.",
  },
  {
    title: "About our services",
    body: "Ragtime-Pro is a modernization partner for European software vendors, combining an AI-augmented Modernization Agent with expert consulting to help legacy software products modernize safely and incrementally. The content on this website — including our AI Solution Categories, methodology, and Modernization Agent descriptions — is provided for general informational purposes and does not constitute a specific recommendation, professional advice, or a binding offer. Any specific recommendation is developed only through a direct engagement with us.",
  },
  {
    title: "No professional advice",
    body: "Nothing on this website should be treated as legal, financial, or regulatory advice, including in relation to the EU AI Act. You should seek independent professional advice before making decisions based on information found here without a formal engagement with Ragtime-Pro.",
  },
  {
    title: "Intellectual property",
    body: "The content of this website — including text, graphics, videos, and the Product Modernization Triad and AI Upgrade Module concepts — is owned by Ragtime-Pro or its licensors and may not be copied, reproduced, or distributed without our permission, other than for your own personal, non-commercial reference.",
  },
  {
    title: "Limitation of liability",
    body: "This website and its content are provided “as is,” without warranties of any kind. To the extent permitted by law, Ragtime-Pro is not liable for any loss or damage arising from your use of this website or reliance on its content.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms from time to time to reflect changes to the website or our services. The date below reflects the last update.",
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Terms of Service</h1>
        <p className="mt-2 font-body text-sm text-charcoal">Last updated: August 10, 2026</p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="flex flex-col gap-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-lg font-semibold text-navy">{section.title}</h2>
              <p className="mt-2 font-body text-base text-charcoal">{section.body}</p>
            </div>
          ))}

          <div>
            <h2 className="font-heading text-lg font-semibold text-navy">Contact us</h2>
            <p className="mt-2 font-body text-base text-charcoal">
              If you have any questions about these terms, contact us at{" "}
              <a
                href="mailto:info@ragtime.pro"
                className="font-semibold text-electric-blue"
              >
                info@ragtime.pro
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
