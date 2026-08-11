import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, projectBySlug } from "@/data/projects";
import { StatusPill } from "@/components/project/ProjectCard";
import { DmFlow } from "@/components/project/DmFlow";
import { VideoPlayer } from "@/components/project/VideoPlayer";
import { Reveal } from "@/components/ui/Reveal";
import { GradientGlow } from "@/components/ui/GradientGlow";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.name} — ${project.tagline}`,
    description: project.hook,
    openGraph: {
      title: `${project.name} — ${project.tagline}`,
      description: project.hook,
      type: "article",
    },
  };
}

const LINK_LABELS: Record<string, string> = {
  live: "Live site",
  code: "Source",
  phone: "Phone",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="pb-24">
      {/* ---- header ---------------------------------------------------- */}
      <header className="relative overflow-hidden pt-32 pb-14 sm:pt-40">
        <GradientGlow
          className="top-[-20%] left-1/2 size-[680px] -translate-x-1/2"
          color={project.accent}
          opacity={0.13}
        />

        <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
          <Link
            href="/#work"
            className="text-ink-muted hover:text-accent mb-8 inline-flex items-center gap-2 text-sm transition-colors"
          >
            <span aria-hidden>←</span> All work
          </Link>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <StatusPill status={project.status} />
            <span className="text-ink-muted font-mono text-[11px] tracking-wide">
              {project.category}
            </span>
            <span className="text-ink-muted font-mono text-[11px]">{project.year}</span>
          </div>

          <h1 className="font-display mt-5 text-[clamp(2.6rem,7vw,4.4rem)] leading-none tracking-tight">
            {project.name}
          </h1>
          <p
            className="font-display mt-3 text-[clamp(1.3rem,3vw,2rem)] italic"
            style={{ color: project.accent }}
          >
            {project.tagline}
          </p>

          {project.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="edge bg-surface hover:border-accent/50 hover:text-accent inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <span className="text-ink-muted font-mono text-[10px] tracking-widest uppercase">
                    {LINK_LABELS[link.kind]}
                  </span>
                  {link.label}
                  <span aria-hidden>↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ---- lead visual ----------------------------------------------- */}
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <div className="edge relative aspect-16/10 overflow-hidden rounded-2xl sm:aspect-video">
            {project.illustration === "dm-flow" ? (
              <DmFlow />
            ) : project.cover ? (
              <Image
                src={project.cover}
                alt={project.coverAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 960px"
                priority
                className="object-cover"
              />
            ) : null}
          </div>
        </Reveal>
      </div>

      {/* ---- metrics ---------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8">
        <dl className="border-hairline divide-hairline mt-14 grid grid-cols-2 gap-y-8 border-y py-9 sm:grid-cols-4 sm:divide-x">
          {project.metrics.map((metric, metricIndex) => (
            <Reveal key={metric.label} delay={metricIndex * 0.06} className="sm:px-6 sm:first:pl-0">
              <dt className="sr-only">{metric.label}</dt>
              <dd>
                <span
                  className="font-display block text-3xl sm:text-4xl"
                  style={{ color: project.accent }}
                >
                  {metric.value}
                </span>
                <span className="text-ink-muted mt-1.5 block text-[13px] leading-snug">
                  {metric.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ---- what it is -------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[200px_1fr] lg:gap-16">
          <Reveal>
            <h2 className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
              What it is
            </h2>
          </Reveal>
          <div className="space-y-5">
            {project.summary.map((paragraph, paragraphIndex) => (
              <Reveal key={paragraphIndex} delay={paragraphIndex * 0.06}>
                <p className="text-ink-dim text-[16px] leading-relaxed sm:text-[17px]">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- how it's built ---------------------------------------------- */}
      <section className="border-hairline border-y">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <Reveal>
            <h2 className="text-ink-muted mb-9 font-mono text-[11px] tracking-[0.2em] uppercase">
              How it&rsquo;s built
            </h2>
          </Reveal>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {project.architecture.map((step, stepIndex) => (
              <Reveal key={step.title} delay={stepIndex * 0.07} as="li">
                <div className="edge bg-surface/40 h-full rounded-xl p-5">
                  <span
                    className="font-mono text-[11px] tracking-widest"
                    style={{ color: project.accent }}
                  >
                    {String(stepIndex + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[15px] font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-ink-dim mt-1.5 text-sm leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- what's included --------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="text-ink-muted mb-9 font-mono text-[11px] tracking-[0.2em] uppercase">
            What&rsquo;s included
          </h2>
        </Reveal>
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {project.features.map((feature, featureIndex) => (
            <Reveal key={feature.title} delay={(featureIndex % 2) * 0.06}>
              <div className="border-hairline border-t pt-5">
                <h3 className="text-[15px] font-semibold tracking-tight">{feature.title}</h3>
                <p className="text-ink-dim mt-2 text-sm leading-relaxed">{feature.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- media ------------------------------------------------------- */}
      {(project.gallery.length > 0 || project.video?.full) && (
        <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
          <Reveal>
            <h2 className="text-ink-muted mb-9 font-mono text-[11px] tracking-[0.2em] uppercase">
              Look at it
            </h2>
          </Reveal>

          {project.video?.full && (
            <Reveal className="mb-4">
              <VideoPlayer
                src={project.video.full}
                poster={project.video.poster}
                label={project.video.fullLabel ?? "Play"}
              />
            </Reveal>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {project.gallery.map((item, itemIndex) => (
              <Reveal
                key={item.src}
                delay={itemIndex * 0.05}
                as="figure"
                className={item.wide ? "sm:col-span-2" : undefined}
              >
                <div className="edge relative aspect-16/10 overflow-hidden rounded-xl">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {item.caption && (
                  <figcaption className="text-ink-muted mt-2.5 text-[13px] leading-relaxed">
                    {item.caption}
                  </figcaption>
                )}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---- stack ------------------------------------------------------- */}
      <section className="border-hairline border-t">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <Reveal>
            <h2 className="text-ink-muted mb-9 font-mono text-[11px] tracking-[0.2em] uppercase">
              Built with
            </h2>
          </Reveal>
          <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {project.stack.map((group, groupIndex) => (
              <Reveal key={group.group} delay={groupIndex * 0.06}>
                <dt className="text-[13px] font-semibold tracking-tight">{group.group}</dt>
                <dd>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="border-hairline text-ink-muted rounded-md border px-2.5 py-1 font-mono text-[11px]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- next -------------------------------------------------------- */}
      <nav className="border-hairline border-t">
        <Link
          href={`/projects/${next.slug}`}
          className="group mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-12 sm:px-8"
        >
          <span>
            <span className="text-ink-muted block font-mono text-[11px] tracking-[0.2em] uppercase">
              Next project
            </span>
            <span className="font-display mt-2 block text-3xl tracking-tight sm:text-4xl">
              {next.name}
            </span>
            <span className="text-ink-dim mt-1 block text-sm">{next.tagline}</span>
          </span>
          <span
            className="shrink-0 text-2xl transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: next.accent }}
            aria-hidden
          >
            →
          </span>
        </Link>
      </nav>
    </article>
  );
}
