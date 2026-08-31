import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RAGnify",
  description: "How RAGnify collects, uses, and protects the information you share with us.",
};

const SECTIONS = [
  {
    title: "Who we are",
    body: "RAGnify is a modernization partner for European software vendors, combining an AI-augmented Modernization Agent with expert consulting to help legacy software products modernize safely and incrementally. This policy explains what information we collect through this website and how we use it.",
  },
  {
    title: "Information we collect",
    body: "When you use the contact form, we collect the information you choose to provide: your name, company, email address, and message, plus an optional phone number and optional description of your AI modernization interest. We do not collect this information anywhere else on the site, and we do not use cookies, analytics, or tracking scripts.",
  },
  {
    title: "How we use your information",
    body: "We use the information you submit solely to respond to your enquiry and, if you engage us, to deliver our services — for example, to schedule an introductory consultation or follow up on your request. We do not sell your information or use it for advertising.",
  },
  {
    title: "Legal basis for processing",
    body: "We process your information based on your consent, given by submitting the contact form, and, where applicable, on the basis that processing is necessary to take steps towards a contract at your request (for example, when discussing a potential engagement).",
  },
  {
    title: "Sharing your information",
    body: "We do not share your information with third parties, except service providers who help us operate this website and respond to your enquiry (for example, email delivery infrastructure), or where required by law. Any such sharing is limited to what is necessary for that purpose.",
  },
  {
    title: "Data retention",
    body: "We retain the information you submit only for as long as needed to respond to your enquiry or, if we begin working together, for the duration of our engagement and any period required by law afterward. You can ask us to delete your information at any time, as described below.",
  },
  {
    title: "Your rights",
    body: "Under the EU General Data Protection Regulation (GDPR), you have the right to access, correct, or delete the personal information we hold about you, to restrict or object to its processing, and to withdraw consent at any time. To exercise any of these rights, contact us using the details below.",
  },
  {
    title: "Changes to this policy",
    body: "We may update this policy from time to time to reflect changes in how the site works or in applicable law. The date below reflects the last update.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Privacy Policy</h1>
        <p className="mt-2 font-body text-sm text-charcoal">Last updated: August 31, 2026</p>
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
              If you have any questions about this policy or wish to exercise your rights,
              contact us at{" "}
              <a
                href="mailto:info@ragnify.pro"
                className="font-semibold text-electric-blue"
              >
                info@ragnify.pro
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
