"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Rnd } from "react-rnd";
import { useChatWidget } from "./ChatWidgetContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PendingConfirm {
  candidateSessionId: string;
  lastSeen: string;
}

interface Size {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

type Phase = "hidden" | "entering" | "shown" | "exiting";

const DEFAULT_WIDTH = 380;
const DEFAULT_HEIGHT = 520;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 380;
const ANIMATION_MS = 550;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export default function ChatWidget() {
  const { isOpen, origin, close } = useChatWidget();

  const [phase, setPhase] = useState<Phase>("hidden");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);
  const [checkingSession, setCheckingSession] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  const [maxSize, setMaxSize] = useState<Size>({ width: 800, height: 800 });
  // Position/size live here (not in context) - ChatWidget is mounted once at
  // the root layout and never unmounts, so this state naturally survives
  // both page navigation and close/reopen without any extra plumbing.
  const [position, setPosition] = useState<Position | null>(null);
  const [size, setSize] = useState<Size | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateMaxSize() {
      setMaxSize({
        width: Math.round(window.innerWidth * 0.5),
        height: Math.round(window.innerHeight * 0.85),
      });
    }
    updateMaxSize();
    window.addEventListener("resize", updateMaxSize);
    return () => window.removeEventListener("resize", updateMaxSize);
  }, []);

  // If the viewport shrinks below a previously-set size/position, pull the
  // pane back into bounds instead of leaving it stranded off-screen or
  // larger than the (now smaller) max.
  useEffect(() => {
    setSize((prev) => {
      if (!prev) return prev;
      const width = clamp(prev.width, MIN_WIDTH, maxSize.width);
      const height = clamp(prev.height, MIN_HEIGHT, maxSize.height);
      return width === prev.width && height === prev.height ? prev : { width, height };
    });
    setPosition((prev) => {
      if (!prev) return prev;
      const x = clamp(prev.x, 0, Math.max(0, window.innerWidth - MIN_WIDTH));
      const y = clamp(prev.y, 0, Math.max(0, window.innerHeight - MIN_HEIGHT));
      return x === prev.x && y === prev.y ? prev : { x, y };
    });
  }, [maxSize]);

  // hidden -> entering -> shown (open), shown -> exiting -> hidden (close).
  // Kept as a phase machine rather than a plain boolean so the closing
  // zoom-to-origin transition actually gets to play before unmounting.
  useEffect(() => {
    if (isOpen && phase === "hidden") {
      setPhase("entering");
    } else if (!isOpen && (phase === "shown" || phase === "entering")) {
      setPhase("exiting");
    }
  }, [isOpen, phase]);

  useEffect(() => {
    if (phase === "entering") {
      const frame = requestAnimationFrame(() => setPhase("shown"));
      return () => cancelAnimationFrame(frame);
    }
    if (phase === "exiting") {
      const timeout = setTimeout(() => setPhase("hidden"), ANIMATION_MS);
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  // Check session status once per widget lifetime, not on every open.
  useEffect(() => {
    if (!isOpen || hasCheckedSession) return;

    setHasCheckedSession(true);
    setCheckingSession(true);

    fetch("/api/rag/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "confirm") {
          setPendingConfirm({ candidateSessionId: data.candidateSessionId, lastSeen: data.lastSeen });
        } else if (data.status === "active" && data.session?.history?.length) {
          setMessages(data.session.history);
        }
      })
      .catch(() => {
        // No session yet is fine - a fresh one is created on first message.
      })
      .finally(() => setCheckingSession(false));
  }, [isOpen, hasCheckedSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingConfirm]);

  async function handleConfirm(accept: boolean) {
    if (!pendingConfirm) return;
    const { candidateSessionId } = pendingConfirm;
    setPendingConfirm(null);
    setCheckingSession(true);

    try {
      const res = await fetch("/api/rag/session/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateSessionId, accept }),
      });
      const data = await res.json();
      if (accept && data.session?.history) {
        setMessages(data.session.history);
      }
    } catch {
      // Fall through to a fresh conversation.
    } finally {
      setCheckingSession(false);
    }
  }

  async function handleSend() {
    const query = input.trim();
    if (!query || sending) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setSending(true);

    try {
      const res = await fetch("/api/rag/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  if (phase === "hidden") return null;

  const effectiveWidth = size?.width ?? Math.min(DEFAULT_WIDTH, Math.max(MIN_WIDTH, maxSize.width));
  const effectiveHeight = size?.height ?? Math.min(DEFAULT_HEIGHT, Math.max(MIN_HEIGHT, maxSize.height));
  const effectivePosition =
    position ??
    (typeof window !== "undefined"
      ? {
          x: Math.max(0, window.innerWidth - effectiveWidth - 32),
          y: Math.max(0, window.innerHeight - effectiveHeight - 32),
        }
      : { x: 0, y: 0 });

  const visible = phase === "shown";
  // transform-origin's pixel values are relative to the element's OWN box,
  // not the viewport - origin.x/y are viewport-absolute (captured via
  // getBoundingClientRect on the trigger), so they need to be translated
  // into pane-local coordinates using the pane's own current position.
  const originStyle = origin
    ? {
        transformOrigin: `${origin.x - effectivePosition.x}px ${origin.y - effectivePosition.y}px`,
      }
    : undefined;

  return (
    <Rnd
      position={effectivePosition}
      size={{ width: effectiveWidth, height: effectiveHeight }}
      minWidth={MIN_WIDTH}
      minHeight={MIN_HEIGHT}
      maxWidth={maxSize.width}
      maxHeight={maxSize.height}
      bounds="window"
      dragHandleClassName="chat-widget-handle"
      style={{ position: "fixed", zIndex: 50 }}
      onDragStop={(_event, data) => setPosition({ x: data.x, y: data.y })}
      onResizeStop={(_event, _direction, ref, _delta, pos) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(pos);
      }}
    >
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-lg border-2 border-black bg-white shadow-2xl transition-all ease-out ${
          visible ? "scale-100 opacity-100" : "scale-[0.05] opacity-0"
        }`}
        style={{ ...originStyle, transitionDuration: `${ANIMATION_MS}ms` }}
      >
        <div className="chat-widget-handle grid h-12 shrink-0 cursor-move grid-cols-[auto_1fr_auto] items-center bg-navy px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-heading text-base font-semibold text-white">
              Ragtime-Pro Chat
            </span>
            <Image
              src="/Bubbles.svg"
              alt=""
              width={298}
              height={216}
              className="h-6 w-auto shrink-0 brightness-0 invert"
            />
          </div>

          {/* Drag affordance - purely decorative, the whole bar is already the drag handle.
              The middle grid column absorbs all leftover space between the title and the
              close button, and this centers the dots within it — so they stay clear of
              both neighbors at any pane width instead of colliding (as flat absolute
              centering on the whole bar used to). */}
          <svg
            viewBox="0 0 16 10"
            fill="currentColor"
            className="pointer-events-none mx-3 h-4 w-4 shrink-0 justify-self-center text-white/80"
            aria-hidden="true"
          >
            <circle cx="2" cy="2" r="1.3" />
            <circle cx="8" cy="2" r="1.3" />
            <circle cx="14" cy="2" r="1.3" />
            <circle cx="2" cy="8" r="1.3" />
            <circle cx="8" cy="8" r="1.3" />
            <circle cx="14" cy="8" r="1.3" />
          </svg>

          <button
            type="button"
            onClick={close}
            aria-label="Close chat"
            className="flex h-7 w-7 items-center justify-center justify-self-end rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="chat-widget-scroll flex-1 space-y-3 overflow-y-auto py-3 pl-4 pr-2">
          {messages.length === 0 && !pendingConfirm && !checkingSession && (
            <p className="font-body text-sm text-charcoal/60">
              Ask me anything about Ragtime-Pro&apos;s AI modernization services.
            </p>
          )}

          {/* Assistant bubbles get an extra pr-2: the list's own pl-4/pr-2 padding
              is asymmetric (tight to the right border for user bubbles), which
              would otherwise skew justify-center off the pane's true midline. */}
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-center pr-2"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 font-body text-sm ${
                  message.role === "user" ? "bg-electric-blue text-white" : "bg-light-grey text-charcoal"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {pendingConfirm && (
            <div className="rounded-lg bg-light-grey p-3">
              <p className="font-body text-sm text-charcoal">
                It looks like you may have a previous conversation. Continue where you left off?
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirm(true)}
                  className="rounded-md bg-navy px-3 py-1.5 font-body text-xs font-semibold text-white transition-colors hover:bg-electric-blue"
                >
                  Yes, continue
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirm(false)}
                  className="rounded-md border border-navy/20 px-3 py-1.5 font-body text-xs font-semibold text-navy transition-colors hover:border-electric-blue hover:text-electric-blue"
                >
                  Start fresh
                </button>
              </div>
            </div>
          )}

          {sending && (
            <div className="flex justify-center pr-2">
              <div className="rounded-lg bg-light-grey px-3 py-2 font-body text-sm text-charcoal/50">
                Thinking…
              </div>
            </div>
          )}

          {error && <p className="font-body text-xs text-red-600">{error}</p>}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex shrink-0 items-end gap-2 border-t border-light-grey px-3 pt-3 pb-6">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question…"
            rows={1}
            disabled={sending || !!pendingConfirm}
            className="max-h-24 flex-1 resize-none rounded-md border border-light-grey bg-light-grey px-3 py-2 font-body text-sm text-charcoal focus:border-electric-blue focus:bg-white focus:outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !input.trim() || !!pendingConfirm}
            className="shrink-0 rounded-md bg-electric-blue px-4 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>

        {/* Resize affordance - purely decorative, react-rnd's actual resize
            handle already covers this corner underneath. */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="pointer-events-none absolute bottom-1 right-1 h-4 w-4 text-charcoal/40"
          aria-hidden="true"
        >
          <path d="M14 2L2 14M14 7L7 14M14 12L12 14" strokeLinecap="round" />
        </svg>
      </div>
    </Rnd>
  );
}
