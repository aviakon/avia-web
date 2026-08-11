import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { GradientGlow } from "@/components/ui/GradientGlow";

export function Contact() {
  return (
    <section
      id="contact"
      className="border-hairline relative scroll-mt-20 overflow-hidden border-t py-28 sm:py-36"
    >
      <GradientGlow
        className="bottom-[-40%] left-1/2 size-[720px] -translate-x-1/2"
        color="#66e3ff"
        opacity={0.12}
        drift
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="text-accent mb-5 font-mono text-[11px] tracking-[0.2em] uppercase">
            Contact
          </p>
          <h2 className="font-display text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[1.05] tracking-tight">
            Looking for someone who ships{" "}
            <span className="font-display text-ink-muted italic">all of it?</span>
          </h2>
          <p className="text-ink-dim mx-auto mt-6 max-w-xl text-[15px] leading-relaxed">
            I am open to roles and collaborations in AI product engineering:
            agents, automation, and the interfaces around them. The fastest way
            to reach me is email.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="bg-ink text-void hover:bg-accent inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold transition-colors"
            >
              {site.email}
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="edge bg-surface hover:border-accent/50 hover:text-accent inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-medium transition-colors"
            >
              GitHub <span aria-hidden>↗</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
