"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function HeroAvatarVideo({ videoSrc = "/Home.mp4" }: { videoSrc?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [progress, setProgress] = useState(0);

  function handleStart() {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
    setActive(true);
  }

  function togglePauseResume() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function handleStop() {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setProgress(0);
    setActive(false);
  }

  function handleEnded() {
    setActive(false);
    setProgress(0);
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  }

  function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const value = Number(event.target.value);
    video.currentTime = (value / 100) * video.duration;
    setProgress(value);
  }

  const showScrubber = active && hovering;

  return (
    <div
      className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full shadow-md"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <button
        type="button"
        onClick={handleStart}
        aria-label="Play introduction video"
        className={`absolute inset-0 z-10 transition-opacity duration-200 ${
          active ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Image src="/Liz.jpg" alt="" fill sizes="144px" className="object-cover" />
        <span
          className={`absolute inset-0 flex items-center justify-center bg-navy/0 transition-colors duration-200 ${
            hovering ? "bg-navy/20" : ""
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={`h-9 w-9 text-white drop-shadow transition-opacity duration-200 ${
              hovering ? "opacity-100" : "opacity-0"
            }`}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>

      <video
        ref={videoRef}
        src={videoSrc}
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        onEnded={handleEnded}
        onPlay={() => setVideoPaused(false)}
        onPause={() => setVideoPaused(true)}
        onTimeUpdate={handleTimeUpdate}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
          active ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {active && (
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-navy/30 transition-opacity duration-200 ${
            showScrubber ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePauseResume}
              aria-label={videoPaused ? "Resume video" : "Pause video"}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-navy transition-colors hover:bg-white"
            >
              {videoPaused ? (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={handleStop}
              aria-label="Stop video"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-navy transition-colors hover:bg-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            aria-label="Seek video"
            className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/40 accent-white [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
        </div>
      )}
    </div>
  );
}
