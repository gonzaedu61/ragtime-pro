"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { useChatWidget } from "./ChatWidgetContext";

// Slim icon-only chat trigger for the navy quote bar on every page except
// Home (which has its own larger ChatBubbleTrigger in the hero). Base icon
// is Bubbles_white.svg (brightness-0 invert, same white-on-navy treatment
// as the chat pane's own header icon); hover crossfades to
// Bubbles_blue_white_border.svg, the same two-stacked-Image technique
// ChatBubbleTrigger uses on Home.
export default function ChatBannerTrigger() {
  const { open } = useChatWidget();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    open({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Open chat"
      className="group absolute right-6 top-1/2 -translate-y-1/2"
    >
      <span className="relative block h-12 w-[66px]">
        <Image
          src="/Bubbles_white.svg"
          alt=""
          width={298}
          height={216}
          className="absolute inset-0 h-full w-full object-contain brightness-0 invert transition-opacity duration-150 group-hover:opacity-0"
        />
        <Image
          src="/Bubbles_blue_white_border.svg"
          alt=""
          width={298}
          height={216}
          className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        />
      </span>
    </button>
  );
}
