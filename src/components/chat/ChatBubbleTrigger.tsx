"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { useChatWidget } from "./ChatWidgetContext";

export default function ChatBubbleTrigger() {
  const { open } = useChatWidget();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    open({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex flex-col items-center gap-2"
      aria-label="Open chat"
    >
      <Image
        src="/Bubbles.svg"
        alt=""
        width={298}
        height={216}
        className="h-20 w-auto transition-transform group-hover:scale-110"
      />
      <span className="font-body text-lg font-medium text-charcoal transition-colors group-hover:text-electric-blue">
        Better a chat …?
      </span>
    </button>
  );
}
