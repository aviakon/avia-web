"use client";

import { motion, useReducedMotion } from "motion/react";
import { headlineLines, site } from "@/data/site";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { GradientGlow } from "@/components/ui/GradientGlow";

/** Word position across the whole headline, so the stagger runs continuously. */
const WORDS = headlineLines.map((line) => line.split(" "));
let running = 0;
const WORD_INDEX = WORDS.map((line) => line.map(() => running++));

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-28 pb-16 sm:pt-32">
      <GradientGlow
        className="top-[-10%] left-[-5%] size-[520px]"
        color="#66e3ff"
        opacity={0.14}
        drift
      />
      <GradientGlow
        className="right-[-10%] bottom-[-15%] size-[460px]"
        color="#ffb86b"
        opacity={0.08}
        drift
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-ink-muted mb-7 flex items-center gap-2.5 font-mono text-[12px] tracking-[0.2em] uppercase"
        >
          <span className="bg-accent size-1.5 animate-pulse rounded-full" />
          {site.role} · {site.location}
        </motion.p>

        {/* The terminal is top aligned with the heading, so the two sit level. */}
        <div className="grid gap-10 lg:grid-cols-[1.12fr_1fr] lg:items-start lg:gap-14">
          <div>
            {/*
              Each word animates in on its own, but the space between them is a
              real text node rather than a margin. Otherwise the heading's text
              content runs together for screen readers, copied text and search
              engines.
            */}
            <h1 className="font-display text-[clamp(2.1rem,4.4vw,3.2rem)] leading-[1.15] tracking-tight">
              {WORDS.map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                  {line.map((word, wordIndex) => (
                    <span key={`${word}-${wordIndex}`}>
                      <motion.span
                        initial={reduced ? false : { opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.75,
                          delay: 0.1 + WORD_INDEX[lineIndex][wordIndex] * 0.055,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="inline-block"
                      >
                        {word}
                      </motion.span>{" "}
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-ink-dim mt-7 max-w-xl text-[15px] leading-relaxed sm:text-[16px]"
            >
              {site.subline}
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9"
            >
              <a
                href="#work"
                className="bg-ink text-void hover:bg-accent group inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold transition-colors"
              >
                See the work
                <span className="transition-transform group-hover:translate-y-0.5">↓</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <TerminalBlock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
