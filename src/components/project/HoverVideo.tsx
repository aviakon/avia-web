"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type HoverVideoProps = {
  src: string;
  webm?: string;
  poster?: string;
  className?: string;
};

/**
 * A muted preview loop that only starts once the card is actually on screen,
 * and pauses again when it leaves. Nothing downloads until then, and reduced
 * motion gets the poster frame alone.
 */
export function HoverVideo({ src, webm, poster, className = "" }: HoverVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          void node.play().catch(() => {
            /* autoplay refused — the poster stays, which is fine */
          });
        } else {
          node.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload={reduced ? "none" : "metadata"}
      aria-hidden
      className={`size-full object-cover transition-opacity duration-700 ${active ? "opacity-100" : "opacity-70"} ${className}`}
    >
      {webm && <source src={webm} type="video/webm" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
