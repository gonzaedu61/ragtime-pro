"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Rnd } from "react-rnd";

interface Source {
  doc_id: string;
  doc_title: string;
  pages: number[];
  heading_path: string[];
  href: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  followUpTopics?: string[];
}

interface Origin {
  x: number;
  y: number;
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

// Standalone, session-scoped chat for the ALMENDRO manuals demo. Reuses the
// site-wide ChatWidget's visual design and floating/draggable mechanic
// (src/components/chat/ChatWidget.tsx), but is otherwise independent: no
// ChatWidgetContext (this pane and its trigger only ever exist on this one
// page), no fingerprint-based cross-device session recovery, no email
// linking - just a cookie + R2-backed history for this browser's session,
// plus a manual reset control, source citations, and follow-up chips that
// that history doesn't need.
export default function AlmendroChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [phase, setPhase] = useState<Phase>("hidden");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  const [maxSize, setMaxSize] = useState<Size>({ width: 800, height: 800 });
  const [position, setPosition] = useState<Position | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  // Rendered via a portal straight to <body> (see the return statement) so
  // react-draggable measures its node in a plain, unnested layout context -
  // nesting it inside this page's centered flex container caused
  // react-draggable to bake the node's in-flow position into its transform
  // math, applying a large, constant offset to every position update
  // regardless of what was actually requested. `mounted` just guards against
  // SSR, where `document` doesn't exist yet.
  const [mounted, setMounted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!isOpen || hasLoadedHistory) return;
    setHasLoadedHistory(true);

    fetch("/api/almendro/answer")
      .then((res) => res.json())
      .then((data) => {
        if (data?.history?.length) setMessages(data.history);
      })
      .catch(() => {
        // No session yet is fine - a fresh one is created on first message.
      });
  }, [isOpen, hasLoadedHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  function handleOpen(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  async function sendQuery(query: string) {
    if (!query.trim() || sending) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setSending(true);

    try {
      const res = await fetch("/api/almendro/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, sources: data.sources, followUpTopics: data.followUpTopics },
      ]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function handleReset() {
    try {
      await fetch("/api/almendro/session/reset", { method: "POST" });
    } catch {
      // Clearing local state below still gives the visitor a fresh-feeling
      // conversation even if the server-side delete failed.
    }
    setMessages([]);
    setError(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendQuery(input);
    }
  }

  // Leaf headings are frequently unnumbered sub-paragraphs of a numbered
  // section (e.g. ["2 Bestellwesen", "2.1 Bestellung", "Unser Zeichen"]) -
  // walking up from the end finds the nearest actual section number instead
  // of showing nothing for those chunks.
  function leafSectionNumber(headingPath: string[]): string | null {
    for (let i = headingPath.length - 1; i >= 0; i--) {
      const match = headingPath[i].match(/^(\d+(?:\.\d+)*)/);
      if (match) return match[1];
    }
    return null;
  }

  function formatSource(source: Source): string {
    const section = leafSectionNumber(source.heading_path);
    return `${source.doc_title}.pdf${section ? ` · ${section}` : ""}`;
  }

  // Opens the source PDF in a fixed-position, fixed-size popup window (reused
  // across clicks via a shared window name) rather than a new tab, so
  // visitors can compare the chat and the source side by side without losing
  // their place.
  function openSourceDocument(href: string) {
    const width = 900;
    const height = 850;
    const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
    const top = Math.max(0, Math.round(window.screenY + 40));
    window.open(href, "almendro-source-viewer", `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`);
  }

  const effectiveWidth = size?.width ?? Math.min(DEFAULT_WIDTH, Math.max(MIN_WIDTH, maxSize.width));
  const effectiveHeight = size?.height ?? Math.min(DEFAULT_HEIGHT, Math.max(MIN_HEIGHT, maxSize.height));

  // Rnd only treats `position` as an initial value and then owns it
  // internally, so once `position` state is set it's never recomputed
  // against the current window size - if the viewport was ever a different
  // size at the moment a default got picked (e.g. captured before a resize,
  // a scrollbar appearing/disappearing, or a browser chrome change), the
  // pane would stay pinned outside the visible viewport indefinitely.
  // Clamping the *displayed* position against the *current* window size on
  // every render, rather than trusting a value captured once, makes this
  // self-correcting regardless of when it was set.
  const rawPosition =
    position ??
    (typeof window !== "undefined"
      ? { x: window.innerWidth - effectiveWidth - 32, y: window.innerHeight - effectiveHeight - 32 }
      : { x: 0, y: 0 });
  const effectivePosition =
    typeof window !== "undefined"
      ? {
          x: clamp(rawPosition.x, 0, Math.max(0, window.innerWidth - effectiveWidth)),
          y: clamp(rawPosition.y, 0, Math.max(0, window.innerHeight - effectiveHeight)),
        }
      : rawPosition;

  const visible = phase === "shown";
  const originStyle = origin
    ? { transformOrigin: `${origin.x - effectivePosition.x}px ${origin.y - effectivePosition.y}px` }
    : undefined;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open ALMENDRO chat"
        className="group inline-flex items-center gap-3 rounded-md bg-navy px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-electric-blue"
      >
        <Image
          src="/Bubbles_white.svg"
          alt=""
          width={298}
          height={216}
          className="h-5 w-auto brightness-0 invert"
        />
        Ask the ALMENDRO assistant
      </button>

      {mounted && phase !== "hidden" && createPortal(
        <Rnd
          position={effectivePosition}
          size={{ width: effectiveWidth, height: effectiveHeight }}
          minWidth={MIN_WIDTH}
          minHeight={MIN_HEIGHT}
          maxWidth={maxSize.width}
          maxHeight={maxSize.height}
          bounds="window"
          dragHandleClassName="almendro-chat-handle"
          style={{ position: "fixed", zIndex: 100 }}
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
            <div className="almendro-chat-handle grid h-12 shrink-0 cursor-move grid-cols-[auto_1fr_auto_auto] items-center gap-2 bg-navy px-4">
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src="/Bubbles_white.svg"
                  alt=""
                  width={298}
                  height={216}
                  className="h-6 w-auto shrink-0 brightness-0 invert"
                />
                <span className="truncate font-heading text-base font-semibold text-white">ALMENDRO Assistant</span>
              </div>
              <span />
              <button
                type="button"
                onClick={handleReset}
                aria-label="Start a new conversation"
                title="Start a new conversation"
                className="flex h-7 w-7 items-center justify-center justify-self-end rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 1 3 6.7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 17v-5h5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close chat"
                className="flex h-7 w-7 items-center justify-center justify-self-end rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto py-3 pl-4 pr-2">
              {messages.length === 0 && !sending && (
                <p className="font-body text-sm text-charcoal/60">
                  Ask a question about the ALMENDRO user manuals - in English, German, or any language.
                </p>
              )}

              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-center pr-2"}`}>
                  <div className="max-w-[85%]">
                    <div
                      className={`whitespace-pre-wrap rounded-lg px-3 py-2 font-body text-sm ${
                        message.role === "user" ? "bg-electric-blue text-white" : "bg-light-grey text-charcoal"
                      }`}
                    >
                      {message.content}
                    </div>

                    {message.role === "assistant" && !!message.sources?.length && (
                      <div className="mt-5">
                        <p className="font-body text-xs font-bold uppercase tracking-wide text-charcoal/90">
                          Source References
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          {message.sources.map((source, sourceIndex) => (
                            <a
                              key={sourceIndex}
                              href={source.href}
                              onClick={(event) => {
                                event.preventDefault();
                                openSourceDocument(source.href);
                              }}
                              className="font-body text-xs text-charcoal/50 underline decoration-dotted hover:text-electric-blue"
                            >
                              {formatSource(source)}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.role === "assistant" && !!message.followUpTopics?.length && (
                      <div className="mt-5">
                        <p className="font-body text-xs font-bold uppercase tracking-wide text-charcoal/90">
                          Related Topics
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {message.followUpTopics.map((topic, topicIndex) => (
                            <button
                              key={topicIndex}
                              type="button"
                              onClick={() => sendQuery(topic)}
                              disabled={sending}
                              className="rounded-full border border-electric-blue/40 px-2.5 py-1 font-body text-xs text-electric-blue transition-colors hover:bg-electric-blue hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-center pr-2">
                  <div className="rounded-lg bg-light-grey px-3 py-2 font-body text-sm text-charcoal/50">Thinking…</div>
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
                disabled={sending}
                className="max-h-24 flex-1 resize-none rounded-md border border-light-grey bg-light-grey px-3 py-2 font-body text-sm text-charcoal focus:border-electric-blue focus:bg-white focus:outline-none disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => sendQuery(input)}
                disabled={sending || !input.trim()}
                className="shrink-0 rounded-md bg-electric-blue px-4 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </Rnd>,
        document.body
      )}
    </>
  );
}
