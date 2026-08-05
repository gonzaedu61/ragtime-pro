"use client";

import { useEffect, useState } from "react";

const PHRASES: [string, string][] = [
  ["Unlock your future …", "adopt AI to transform your business"],
  ["If the path is not clear …", "we shape your AI roadmap"],
  ["If there are doubts …", "we become your trusted advisor"],
  ["If skills are missing …", "we find the right ones for your journey"],
  ["If resources are limited …", "we adjust the roadmap to your capabilities"],
];

const STAY_MS = 8000;
const FADE_MS = 900;

export default function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let stayTimeout: ReturnType<typeof setTimeout>;
    let fadeTimeout: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      stayTimeout = setTimeout(() => {
        setVisible(false);
        fadeTimeout = setTimeout(() => {
          setIndex((prev) => (prev + 1) % PHRASES.length);
          setVisible(true);
          scheduleNext();
        }, FADE_MS);
      }, STAY_MS);
    }

    scheduleNext();

    return () => {
      clearTimeout(stayTimeout);
      clearTimeout(fadeTimeout);
    };
  }, []);

  const [line1, line2] = PHRASES[index];

  return (
    <h1
      className={`min-h-[2.4em] font-heading text-4xl font-bold leading-[1.2] text-navy transition-opacity sm:text-5xl ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      {line1}
      <br />
      {line2}
    </h1>
  );
}
