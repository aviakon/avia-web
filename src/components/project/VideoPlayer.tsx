"use client";

import { useRef, useState } from "react";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  label: string;
};

/**
 * Click-to-play video. Nothing is fetched until the poster is clicked, so a
 * six-megabyte commercial costs a visitor nothing unless they want it.
 */
export function VideoPlayer({ src, poster, label }: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  return (
    <div className="edge relative overflow-hidden rounded-2xl">
      <video
        ref={ref}
        src={src}
        poster={poster}
        controls={started}
        playsInline
        preload="none"
        className="aspect-video w-full bg-black"
      />

      {!started && (
        <button
          type="button"
          onClick={() => {
            setStarted(true);
            void ref.current?.play();
          }}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/35 transition-colors hover:bg-black/20"
        >
          <span className="bg-ink text-void flex size-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-1 size-6" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-ink text-sm font-medium">{label}</span>
        </button>
      )}
    </div>
  );
}
