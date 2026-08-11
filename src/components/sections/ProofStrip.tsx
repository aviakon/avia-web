import { proofStats } from "@/data/projects";
import { StatCounter } from "@/components/ui/StatCounter";
import { ToolMarquee } from "@/components/ui/ToolMarquee";
import { Reveal } from "@/components/ui/Reveal";

export function ProofStrip() {
  return (
    <section className="border-hairline border-y">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <dl className="divide-hairline grid grid-cols-2 md:grid-cols-4 md:divide-x">
          {proofStats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 0.08}
              className="border-hairline border-b px-1 py-7 md:border-b-0 md:px-6 md:first:pl-0 md:last:pr-0"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="font-display text-accent block text-4xl sm:text-5xl">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-ink-muted mt-1.5 block text-[13px] leading-snug">
                  {stat.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>

        <div className="border-hairline border-t py-5">
          <ToolMarquee />
        </div>
      </div>
    </section>
  );
}
