import Link from "next/link";
import type { Project } from "@/data/projects";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ProjectVisual } from "./ProjectVisual";

export function StatusPill({ status }: { status: Project["status"] }) {
  const live = status === "Live in production";
  return (
    <span className="text-ink-muted inline-flex items-center gap-1.5 font-mono text-[12px] tracking-widest uppercase">
      <span
        className={`size-1.5 rounded-full ${live ? "bg-accent animate-pulse" : "bg-ink-muted"}`}
      />
      {status}
    </span>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <SpotlightCard
      accent={project.accent}
      className="edge bg-surface/50 h-full rounded-2xl transition-colors duration-500 hover:border-[color-mix(in_oklab,var(--accent)_45%,transparent)]"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="flex h-full flex-col focus-visible:outline-none"
      >
        <div className="border-hairline relative aspect-16/10 overflow-hidden rounded-t-2xl border-b">
          <ProjectVisual project={project} />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight">{project.name}</h3>
            <span
              className="mt-1 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
              style={{ color: project.accent }}
              aria-hidden
            >
              →
            </span>
          </div>

          <p className="text-ink-muted mt-1 font-mono text-[12px] tracking-wide">
            {project.category}
          </p>

          <p className="text-ink-dim mt-3.5 flex-1 text-sm leading-relaxed">
            {project.hook}
          </p>

          <div className="border-hairline mt-6 flex items-center justify-between border-t pt-4">
            <StatusPill status={project.status} />
            <span className="text-ink-muted font-mono text-[12px]">{project.year}</span>
          </div>
        </div>
      </Link>
    </SpotlightCard>
  );
}
