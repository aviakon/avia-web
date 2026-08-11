import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  blurb?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  blurb,
  className = "",
}: SectionHeadingProps) {
  return (
    <Reveal className={`max-w-2xl ${className}`}>
      <p className="text-accent mb-4 flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase">
        <span className="bg-accent/40 h-px w-8" />
        {eyebrow}
      </p>
      <h2 className="font-display text-[clamp(2rem,4.4vw,3.1rem)] leading-[1.08] tracking-tight">
        {title}
      </h2>
      {blurb && (
        <p className="text-ink-dim mt-5 text-[15px] leading-relaxed">{blurb}</p>
      )}
    </Reveal>
  );
}
