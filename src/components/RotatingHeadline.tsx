"use client";

import { useEffect, useState } from "react";

const PHRASES: [string, string][] = [
  ["If your product seems to be falling behind…", "we bring it back to the front"],
  ["Your software doesn't need a rewrite…", "It needs a new rhythm."],
  ["If daily operations lock your resources…", "we bring the capacity to make it happen."],
  ["If customer satisfaction is fading…", "we help your product win their hearts again"],
  ["If AI modernization feels overwhelming…", "we make it simple and doable"],
];

const STAY_MS = 8000;
const FADE_MS = 900;

export default function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * PHRASES.length));

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
