import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GradientGlow } from "@/components/ui/GradientGlow";

const principles = [
  {
    title: "Ship the whole thing",
    body: "The interface, the agent behind it, the automations nobody sees, and the film that sells it.",
  },
  {
    title: "AI tooling is the leverage",
    body: "It is how one person covers backend, iOS, systems programming and ad creative in the same year.",
  },
  {
    title: "It has to work without the API key",
    body: "Two of these run fully offline and upgrade themselves the moment a key appears.",
  },
  {
    title: "Privacy is an architecture",
    body: "Local storage, redaction before anything is written, analytics hashed nightly. Decided in the code.",
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
              oneLine
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
                A voice agent that sells a physical product. A vision model that
                counts poker chips. A job platform reading six sources in two
                languages. Different stacks, one habit: take it all the way to
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
