import { toolMarquee } from "@/data/skills";

/** A slow, endlessly scrolling band of tool names. Pure CSS. */
export function ToolMarquee() {
  const row = [...toolMarquee, ...toolMarquee];

  return (
    <div className="mask-fade-x relative w-full overflow-hidden py-2">
      <div className="animate-marquee flex w-max gap-3">
        {row.map((tool, index) => (
          <span
            key={`${tool}-${index}`}
            className="edge text-ink-dim bg-surface/50 rounded-full px-4 py-1.5 font-mono text-xs whitespace-nowrap"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
