"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Seconds of delay, for staggering siblings. */
  delay?: number;
  /** How far it travels on the way in. */
  distance?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "figure";
};

/**
 * Fades and lifts its children into place the first time they enter the
 * viewport. Transform/opacity only, so it never triggers layout.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 24,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
