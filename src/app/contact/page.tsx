"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSending(true);

    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message.");
      }

      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong sending your message. Please try again or email us directly."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-6 pb-8 text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Contact Us</h1>
      </section>

      <section className="bg-navy py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-heading text-2xl font-medium italic text-white">
            &ldquo;We are prepared to support you from the very first question.&rdquo;
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="text-center lg:text-left">
            <p className="font-body text-lg text-charcoal">
              Tell us a bit about your business and where AI fits into it. Whether you already
              have a specific project in mind or you&apos;re still trying to figure out where to
              start, we want to hear it in your own words — the problem you&apos;re trying to
              solve, the process that&apos;s slowing your team down, or simply the question you
              haven&apos;t found a good answer to yet. There&apos;s no wrong way to describe it;
              the clearer picture you give us, the faster we can point you toward what&apos;s
              actually worth doing next.
            </p>
            <p className="mt-4 flex flex-wrap items-center justify-center gap-2 font-body text-base italic text-charcoal lg:justify-start">
              <span>
                Or reach us directly at{" "}
                <a
                  href="mailto:info@thebrokerAI.tech"
                  className="font-semibold text-electric-blue"
                >
                  info@thebrokerAI.tech
                </a>
              </span>
              <Image
                src="/mail_icon.svg"
                alt=""
                width={149}
                height={149}
                className="h-10 w-auto"
              />
            </p>
          </div>

          <div>
            {submitted ? (
              <div className="rounded-lg bg-light-grey p-6 text-center">
                <p className="font-heading text-lg font-semibold text-navy">Thank you.</p>
                <p className="mt-2 font-body text-sm text-charcoal">
                  We&apos;ve received your message and will be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name" className="font-body text-sm font-semibold text-navy">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 w-full rounded-md border border-light-grey bg-light-grey px-4 py-1.5 font-body text-charcoal focus:border-electric-blue focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="font-body text-sm font-semibold text-navy">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    className="mt-1 w-full rounded-md border border-light-grey bg-light-grey px-4 py-1.5 font-body text-charcoal focus:border-electric-blue focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="font-body text-sm font-semibold text-navy">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-md border border-light-grey bg-light-grey px-4 py-1.5 font-body text-charcoal focus:border-electric-blue focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="font-body text-sm font-semibold text-navy">
                    Phone <span className="font-normal text-charcoal">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-1 w-full rounded-md border border-light-grey bg-light-grey px-4 py-1.5 font-body text-charcoal focus:border-electric-blue focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="aiInterest"
                    className="font-body text-sm font-semibold text-navy"
                  >
                    Describe your AI interest{" "}
                    <span className="font-normal text-charcoal">(optional)</span>
                  </label>
                  <input
                    id="aiInterest"
                    name="aiInterest"
                    type="text"
                    list="ai-interest-options"
                    placeholder="Choose from the list or type your own"
                    className="mt-1 w-full rounded-md border border-light-grey bg-light-grey px-4 py-1.5 font-body text-charcoal focus:border-electric-blue focus:bg-white focus:outline-none"
                  />
                  <datalist id="ai-interest-options">
                    <option value="Personal Productivity" />
                    <option value="Intelligent Workflows" />
                    <option value="RAG Solutions" />
                    <option value="Reasoning Agents" />
                    <option value="Custom AI Models" />
                    <option value="EU AI Act Compliance" />
                    <option value="Not sure yet — I need guidance" />
                  </datalist>
                </div>

                <div>
                  <label htmlFor="message" className="font-body text-sm font-semibold text-navy">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="mt-1 w-full rounded-md border border-light-grey bg-light-grey px-4 py-1.5 font-body text-charcoal focus:border-electric-blue focus:bg-white focus:outline-none"
                  />
                </div>

                {error && (
                  <p className="font-body text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="rounded-md bg-electric-blue px-6 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSending ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
