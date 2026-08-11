"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type Line = {
  kind: "prompt" | "tool" | "note" | "done";
  text: string;
};

const SCRIPT: Line[] = [
  { kind: "prompt", text: "give the agent a real phone number" },
  { kind: "tool", text: "Read  lib/contact.ts" },
  { kind: "tool", text: "Write app/api/twilio/voice/route.ts" },
  { kind: "tool", text: "Bash  npm run provision:agent" },
  { kind: "note", text: "registered 5 webhook tools · knowledge base synced" },
  { kind: "done", text: "+972 53 388 3184 answers, takes orders, books meetings" },
];

const TYPE_MS = 22;
const LINE_PAUSE_MS = 340;
const LOOP_PAUSE_MS = 4200;

const STYLES: Record<Line["kind"], string> = {
  prompt: "text-ink",
  tool: "text-ink-dim",
  note: "text-ink-muted",
  done: "text-accent",
};

/**
 * A stylised Claude Code session that types itself out and loops. Purely
 * decorative — it carries aria-hidden and collapses to a static transcript
 * when reduced motion is requested.
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
          claude code · automa
        </span>
      </div>

      <div className="min-h-[248px] space-y-2 p-4 font-mono text-[12.5px] leading-relaxed sm:min-h-[228px] sm:text-[13px]">
        {visible.map((line, index) => {
          const isCurrent = !reduced && index === lineIndex;
          const text = isCurrent ? line.text.slice(0, charCount) : line.text;

          return (
            <div key={`${line.text}-${index}`} className="flex gap-2.5">
              <span
                className={
                  line.kind === "prompt"
                    ? "text-accent shrink-0"
                    : line.kind === "done"
                      ? "text-accent shrink-0"
                      : "text-ink-muted shrink-0"
                }
              >
                {line.kind === "prompt" ? ">" : line.kind === "done" ? "✓" : "·"}
              </span>
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
