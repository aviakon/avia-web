import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GradientGlow } from "@/components/ui/GradientGlow";

const principles = [
  {
    title: "Ship the whole thing",
    body: "A product is not the interface. It is the interface, the agent behind it, the automations nobody sees, and the film that sells it. I build all four rather than handing off after the first.",
  },
  {
    title: "Claude Code as the workshop",
    body: "AI tooling is how one person covers backend, iOS, desktop systems programming and ad creative in the same year. The leverage is real, and this site is one more instance of it.",
  },
  {
    title: "It has to work without the API key",
    body: "Two of these projects run fully offline on heuristics and upgrade themselves the moment a key appears. An AI feature that collapses without a network is not a feature.",
  },
  {
    title: "Privacy is an architecture, not a policy page",
    body: "Storage that stays local, redaction by pattern before anything is written, analytics hashed with a salt that rotates nightly. Decisions made in the code, not in a disclaimer.",
  },
];

export function About() {
  return (
    <section id="about" className="relative scroll-mt-20 py-24 sm:py-32">
      <GradientGlow
        className="top-1/3 right-0 size-[420px]"
        color="#ffb86b"
        opacity={0.07}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="About"
              title={
                <>
                  I build with AI,{" "}
                  <span className="font-display text-ink-muted italic">
                    not just about it
                  </span>
                </>
              }
            />

            <Reveal delay={0.1}>
              <p className="text-ink-dim mt-6 text-[15px] leading-relaxed">
                {site.shortBio}
              </p>
              <p className="text-ink-dim mt-4 text-[15px] leading-relaxed">
                The work spans a voice agent that answers a real phone number and
                sells a physical product, a vision model that counts poker chips
                from a photograph, a job matching platform reading six live
                sources in two languages, an Instagram automation running a real
                storefront, and a desktop agent built straight onto the Windows
                system layer. Different stacks, one habit: take it all the way to
                production.
              </p>
            </Reveal>
          </div>

          <ul className="space-y-3">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.07} as="li">
                <div className="edge bg-surface/40 rounded-xl p-6">
                  <h3 className="text-[15px] font-semibold tracking-tight">
                    {principle.title}
                  </h3>
                  <p className="text-ink-dim mt-2 text-sm leading-relaxed">
                    {principle.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
