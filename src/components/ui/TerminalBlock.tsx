"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type Line = {
  kind: "prompt" | "item" | "done";
  /** Fixed width column on the left, printed as soon as the line starts. */
  label?: string;
  text: string;
};

const SCRIPT: Line[] = [
  { kind: "prompt", text: "what do you actually build?" },
  { kind: "item", label: "vibe coding", text: "five products, shipped end to end" },
  { kind: "item", label: "automations", text: "eleven flows running a live business" },
  { kind: "item", label: "voice agents", text: "one real phone number, real orders" },
  { kind: "item", label: "ai video", text: "a commercial generated start to finish" },
  { kind: "item", label: "marketing", text: "content and bots for a real storefront" },
  { kind: "done", text: "shipped, not just prototyped" },
];

const TYPE_MS = 17;
const LINE_PAUSE_MS = 260;
const LOOP_PAUSE_MS = 4600;

const STYLES: Record<Line["kind"], string> = {
  prompt: "text-ink",
  item: "text-ink-dim",
  done: "text-accent",
};

/**
 * A stylised Claude Code session that answers the one question a recruiter is
 * actually asking, and loops. Purely decorative: it carries aria-hidden, and
 * the same content is present as real copy elsewhere on the page.
 */
export function TerminalBlock() {
  const reduced = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (reduced) return;

    const line = SCRIPT[lineIndex];

    if (charCount < line.text.length) {
      timer.current = setTimeout(() => setCharCount((c) => c + 1), TYPE_MS);
    } else if (lineIndex < SCRIPT.length - 1) {
      timer.current = setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharCount(0);
      }, LINE_PAUSE_MS);
    } else {
      timer.current = setTimeout(() => {
        setLineIndex(0);
        setCharCount(0);
      }, LOOP_PAUSE_MS);
    }

    return () => clearTimeout(timer.current);
  }, [lineIndex, charCount, reduced]);

  const visible = reduced ? SCRIPT : SCRIPT.slice(0, lineIndex + 1);

  return (
    <div
      aria-hidden
      className="edge bg-surface/80 relative w-full overflow-hidden rounded-xl backdrop-blur-sm"
    >
      <div className="border-hairline flex items-center gap-2 border-b px-4 py-2.5">
        <span className="bg-hairline-strong size-2.5 rounded-full" />
        <span className="bg-hairline-strong size-2.5 rounded-full" />
        <span className="bg-hairline-strong size-2.5 rounded-full" />
        <span className="text-ink-muted ml-2 font-mono text-[11px] tracking-wider">
          ~/avia
        </span>
      </div>

      <div className="min-h-[276px] space-y-2 p-4 font-mono text-[12px] leading-relaxed sm:text-[12.5px]">
        {visible.map((line, index) => {
          const isCurrent = !reduced && index === lineIndex;
          const text = isCurrent ? line.text.slice(0, charCount) : line.text;

          return (
            <div key={`${line.text}-${index}`} className="flex gap-2.5">
              <span
                className={`shrink-0 ${line.kind === "item" ? "text-ink-muted" : "text-accent"}`}
              >
                {line.kind === "prompt" ? ">" : line.kind === "done" ? "✓" : "·"}
              </span>

              {line.label && (
                <span className="text-accent w-[104px] shrink-0">{line.label}</span>
              )}

              <span className={`${STYLES[line.kind]} break-words`}>
                {text}
                {isCurrent && (
                  <span className="bg-accent animate-caret ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px]" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
