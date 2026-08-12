"use client";

import { useEffect, useRef, useState } from "react";

type StatCounterProps = {
  value: number;
  suffix?: string;
  durationMs?: number;
};

/**
 * Counts up to `value` once, the first time it scrolls into view.
 *
 * The number is rendered in full on the server and only reset to zero once the
 * client has decided it can animate, so the real figure is what ships in the
 * HTML: correct without JavaScript, correct for a crawler, and correct if the
 * animation is ever interrupted. The count up is decoration layered on top.
 */
export function StatCounter({ value, suffix = "", durationMs = 1100 }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || started.current) return;

    // Honour the OS setting directly. Motion's hook reports null on the first
    // render, which is easy to mistake for "no preference".
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const animate = () => {
      if (started.current) return;
      started.current = true;

      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        // Ease-out cubic so it settles rather than stopping dead.
        setDisplay(Math.round((1 - Math.pow(1 - progress, 3)) * value));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDisplay(0);
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
