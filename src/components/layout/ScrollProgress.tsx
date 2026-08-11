"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** A hairline at the very top of the page that fills as you scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="from-accent to-ember fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r"
    />
  );
}
