import Image from "next/image";
import type { Project } from "@/data/projects";
import { DmFlow } from "./DmFlow";

type ProjectVisualProps = {
  project: Project;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

/**
 * A project's cover image, or — until a screenshot has been chosen — a
 * generated plate built from the project's own accent and monogram so the
 * layout never shows a hole.
 */
export function ProjectVisual({
  project,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ProjectVisualProps) {
  if (project.illustration === "dm-flow") {
    return <DmFlow />;
  }

  if (project.cover) {
    return (
      <Image
        src={project.cover}
        alt={project.coverAlt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, ${project.accent} 18%, #0a0a0f) 0%, #0a0a0f 68%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.045) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(90% 70% at 50% 40%, black, transparent 80%)",
        }}
      />
      <span
        className="font-display relative text-[clamp(2.5rem,7vw,4.5rem)] leading-none tracking-tight opacity-90"
        style={{ color: project.accent }}
      >
        {project.name}
      </span>
    </div>
  );
}
