"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function RoadmapVideoButton({
  label,
  src = "/AI_Roadmap_Guide.mp4",
  lowBandwidthSrc,
  ariaLabel = "Play the video",
  iconClassName = "h-12 w-auto",
  blueHoverIcon = true,
}: {
  label?: string;
  src?: string;
  lowBandwidthSrc?: string;
  ariaLabel?: string;
  iconClassName?: string;
  blueHoverIcon?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [origin, setOrigin] = useState({ dx: 0, dy: 0 });
  const [videoSrc, setVideoSrc] = useState(src);
  const iconRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lowBandwidthSrc) return;
    const connection = (
      navigator as Navigator & {
        connection?: {
          saveData?: boolean;
          effectiveType?: string;
          addEventListener?: (type: "change", listener: () => void) => void;
          removeEventListener?: (
            type: "change",
            listener: () => void,
          ) => void;
        };
      }
    ).connection;
    if (!connection) return;

    function updateSource() {
      const isSlow =
        connection!.saveData ||
        ["slow-2g", "2g", "3g"].includes(connection!.effectiveType ?? "");
      setVideoSrc(isSlow ? lowBandwidthSrc! : src);
    }

    updateSource();
    connection.addEventListener?.("change", updateSource);
    return () => connection.removeEventListener?.("change", updateSource);
  }, [src, lowBandwidthSrc]);

  function openModal() {
    const rect = iconRef.current?.getBoundingClientRect();
    if (rect) {
      const iconCenterX = rect.left + rect.width / 2;
      const iconCenterY = rect.top + rect.height / 2;
      setOrigin({
        dx: iconCenterX - window.innerWidth / 2,
        dy: iconCenterY - window.innerHeight / 2,
      });
    }
    setIsOpen(true);
  }

  function closeModal() {
    setAnimateIn(false);
    setTimeout(() => setIsOpen(false), 250);
  }

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setAnimateIn(true), 20);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label={ariaLabel}
        className="group flex flex-col items-center gap-3"
      >
        {label && (
          <span className="rounded-md border border-navy px-6 py-3 font-body text-sm font-semibold text-navy transition-colors group-hover:bg-light-grey">
            {label}
          </span>
        )}
        <span className="grid">
          <Image
            ref={iconRef}
            src="/video_icon.svg"
            alt=""
            width={114}
            height={109}
            className={`col-start-1 row-start-1 ${blueHoverIcon ? "transition-opacity duration-150 group-hover:opacity-0" : ""} ${iconClassName}`}
          />
          {blueHoverIcon && (
            <Image
              src="/video_icon_blue.svg"
              alt=""
              width={114}
              height={109}
              className={`col-start-1 row-start-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${iconClassName}`}
            />
          )}
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 transition-opacity duration-300"
          style={{ opacity: animateIn ? 1 : 0 }}
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-6xl px-6 transition-transform duration-300 ease-out"
            style={{
              transform: animateIn
                ? "translate(0, 0) scale(1)"
                : `translate(${origin.dx}px, ${origin.dy}px) scale(0.05)`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close video"
              className="absolute -top-10 right-6 font-body text-sm font-semibold text-white transition-colors hover:text-electric-blue"
            >
              Close ✕
            </button>
            <video
              key={videoSrc}
              src={videoSrc}
              controls
              autoPlay
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
