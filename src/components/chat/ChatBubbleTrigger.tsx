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
      <span className="relative block h-20 w-[110px]">
        <Image
          src="/Bubbles_grey.svg"
          alt=""
          width={298}
          height={216}
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-150 group-hover:opacity-0"
        />
        <Image
          src="/Bubbles_blue.svg"
          alt=""
          width={298}
          height={216}
          className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        />
      </span>
      <span className="font-body text-lg font-medium text-charcoal">
        Better a chat …?
      </span>
    </button>
  );
}
