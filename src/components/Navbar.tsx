"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "The AI Dilemma", href: "/ai-dilemma" },
  { label: "AI Solutions", href: "/solutions" },
  { label: "Our Methodology", href: "/methodology" },
  { label: "About Us", href: "/about" },
  { label: "Engagement Model", href: "/engagement-model" },
  { label: "EU Compliance", href: "/eu-ai-act-compliance" },
  { label: "Start Your Journey", href: "/start" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-light-grey bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-10 px-6 py-4">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative h-[52px] w-[52px] [perspective:1000px]">
            <div
              className={`relative h-full w-full [transform-style:preserve-3d] ${
                isHome ? "" : "animate-[spin-3d_10s_linear_infinite]"
              }`}
            >
              <Image
                src="/logo.png"
                alt="The BrokerAI"
                width={52}
                height={52}
                priority
                className="absolute inset-0 [backface-visibility:hidden]"
              />
              <Image
                src="/logo.png"
                alt=""
                aria-hidden="true"
                width={52}
                height={52}
                className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
              />
            </div>
          </div>
          <span className="whitespace-nowrap font-heading text-lg font-semibold text-navy transition-colors group-hover:text-electric-blue">
            The BrokerAI
          </span>
        </Link>

        <nav className="hidden xl:flex xl:items-center xl:gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap font-body text-base text-charcoal transition-colors hover:text-electric-blue"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex items-center justify-center rounded-md p-2 text-navy xl:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <nav className="border-t border-light-grey bg-white xl:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2 font-body text-sm text-charcoal transition-colors hover:text-electric-blue"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
