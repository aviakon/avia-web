import Link from "next/link";
import { site } from "@/data/site";
import { projects } from "@/data/projects";

export function Footer() {
  return (
    <footer className="border-hairline border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl italic">{site.name}</p>
          <p className="text-ink-muted mt-2 max-w-xs text-sm leading-relaxed">
            {site.role} · {site.location}
          </p>
        </div>

        <nav aria-label="Case studies">
          <p className="text-ink-muted mb-3 font-mono text-[11px] tracking-widest uppercase">
            Work
          </p>
          <ul className="space-y-2">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-ink-dim hover:text-accent text-sm transition-colors"
                >
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-ink-muted mb-3 font-mono text-[11px] tracking-widest uppercase">
            Elsewhere
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-ink-dim hover:text-accent text-sm transition-colors"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="text-ink-dim hover:text-accent text-sm transition-colors"
              >
                GitHub / {site.githubHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-hairline text-ink-muted mx-auto max-w-6xl border-t px-5 py-6 font-mono text-[11px] sm:px-8">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
      </div>
    </footer>
  );
}
