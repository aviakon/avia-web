import Link from "next/link";
import { featuredProject, otherProjects } from "@/data/projects";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ProjectCard, StatusPill } from "@/components/project/ProjectCard";
import { ProjectVisual } from "@/components/project/ProjectVisual";
import { HoverVideo } from "@/components/project/HoverVideo";

function Flagship() {
  const project = featuredProject;

  return (
    <Reveal as="article">
      <SpotlightCard
        accent={project.accent}
        className="edge bg-surface/50 rounded-3xl transition-colors duration-500 hover:border-[color-mix(in_oklab,var(--accent)_40%,transparent)]"
      >
        <Link
          href={`/projects/${project.slug}`}
          className="grid focus-visible:outline-none lg:grid-cols-[1.1fr_1fr]"
        >
          <div className="border-hairline relative aspect-16/10 overflow-hidden rounded-t-3xl border-b lg:aspect-auto lg:rounded-l-3xl lg:rounded-tr-none lg:border-r lg:border-b-0">
            {project.video?.preview ? (
              <HoverVideo
                src={project.video.preview}
                webm={project.video.previewWebm}
                poster={project.video.poster}
              />
            ) : (
              <ProjectVisual project={project} priority sizes="(max-width: 1024px) 100vw, 55vw" />
            )}
            <span className="bg-void/70 text-ink absolute top-4 left-4 rounded-full px-3 py-1.5 font-mono text-[10.5px] tracking-widest uppercase backdrop-blur-sm">
              Flagship
            </span>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10">
            <StatusPill status={project.status} />

            <h3 className="font-display mt-4 text-[clamp(2rem,3.6vw,2.8rem)] leading-none tracking-tight">
              {project.name}
            </h3>
            <p
              className="font-display mt-2 text-xl italic"
              style={{ color: project.accent }}
            >
              {project.tagline}
            </p>

            <p className="text-ink-dim mt-5 text-[15px] leading-relaxed">
              {project.hook}
            </p>

            <dl className="border-hairline mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 sm:grid-cols-4">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="block text-xl font-semibold tracking-tight">
                      {metric.value}
                    </span>
                    <span className="text-ink-muted mt-0.5 block text-[11px] leading-tight">
                      {metric.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <span
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: project.accent }}
            >
              Read the case study <span aria-hidden>→</span>
            </span>
          </div>
        </Link>
      </SpotlightCard>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section id="work" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Selected work"
          title={
            <>
              Five products,{" "}
              <span className="font-display text-ink-muted italic">
                built end to end
              </span>
            </>
          }
          blurb="Each one covers the whole distance — product, interface, the AI underneath, the automations that keep it running, and the marketing that sells it."
        />

        <div className="mt-14 space-y-4">
          <Flagship />

          <div className="grid gap-4 md:grid-cols-2">
            {otherProjects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.06} as="article" className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
