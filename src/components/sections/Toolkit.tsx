import Link from "next/link";
import { skillGroups } from "@/data/skills";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { GradientGlow } from "@/components/ui/GradientGlow";

export function Toolkit() {
  return (
    <section id="capabilities" className="relative scroll-mt-20 py-24 sm:py-32">
      <GradientGlow
        className="top-1/4 left-1/2 size-[600px] -translate-x-1/2"
        color="#66e3ff"
        opacity={0.06}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Capabilities"
          title={
            <>
              Four things I do,{" "}
              <span className="font-display text-ink-muted italic">
                and where each one is proven
              </span>
            </>
          }
          blurb="Every capability below points at a shipped project rather than a certificate. If a claim is on this page, there is a live URL or a repository behind it."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {skillGroups.map((group, index) => (
            <Reveal key={group.id} delay={index * 0.07} as="article">
              <SpotlightCard className="edge bg-surface/60 h-full rounded-2xl p-7">
                <h3 className="text-lg font-semibold tracking-tight">{group.title}</h3>
                <p className="text-ink-dim mt-2.5 text-sm leading-relaxed">
                  {group.blurb}
                </p>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-hairline text-ink-muted rounded-md border px-2.5 py-1 font-mono text-[11px]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="border-hairline mt-6 flex flex-wrap gap-x-5 gap-y-1.5 border-t pt-5">
                  {group.evidence.map((evidence) => (
                    <Link
                      key={evidence.slug}
                      href={`/projects/${evidence.slug}`}
                      className="text-ink-dim hover:text-accent text-[13px] transition-colors"
                    >
                      {evidence.label} <span aria-hidden>→</span>
                    </Link>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
