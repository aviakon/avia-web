import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  blurb?: string;
  className?: string;
  /**
   * Hold the title on a single line once there is room for it. Below that
   * breakpoint it wraps normally, rather than overflowing a phone.
   */
  oneLine?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  blurb,
  className = "",
  oneLine = false,
}: SectionHeadingProps) {
  return (
    <Reveal className={`${oneLine ? "max-w-4xl" : "max-w-2xl"} ${className}`}>
      <p className="text-accent mb-4 flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase">
        <span className="bg-accent/40 h-px w-8" />
        {eyebrow}
      </p>
      <h2
        className={`font-display leading-[1.08] tracking-tight ${
          oneLine
            ? "text-[clamp(1.75rem,3.6vw,2.7rem)] lg:whitespace-nowrap"
            : "text-[clamp(2rem,4.4vw,3.1rem)]"
        }`}
      >
        {title}
      </h2>
      {blurb && (
        <p className="text-ink-dim mt-5 max-w-2xl text-[15px] leading-relaxed">{blurb}</p>
      )}
    </Reveal>
  );
}
