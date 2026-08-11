"use client";

import { useRef, type ReactNode } from "react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Hex colour of the glow that follows the cursor. */
  accent?: string;
};

/**
 * A surface with a soft radial highlight that tracks the pointer. The position
 * is written straight to CSS custom properties so React never re-renders on
 * mouse move.
 */
export function SpotlightCard({
  children,
  className = "",
  accent = "#66e3ff",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerMove={(event) => {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        node.style.setProperty("--x", `${event.clientX - rect.left}px`);
        node.style.setProperty("--y", `${event.clientY - rect.top}px`);
      }}
      style={{ ["--accent" as string]: accent }}
      className={`group relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
