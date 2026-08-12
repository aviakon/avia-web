import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { MediaItem } from "@/data/projects";

type GalleryGridProps = {
  items: MediaItem[];
  /** Columns the grid lays out in on a wide screen. Three suits phone shots. */
  columns?: 2 | 3;
};

/**
 * A grid of screenshots with captions. Used both for a project's "Look at it"
 * section and, for projects whose product is a sequence of screens rather than
 * one page, as the lead visual itself.
 */
export function GalleryGrid({ items, columns }: GalleryGridProps) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((item, itemIndex) => (
        <Reveal
          key={item.src}
          delay={itemIndex * 0.05}
          as="figure"
          className={item.wide ? "sm:col-span-2" : undefined}
        >
          <div
            className="edge relative overflow-hidden rounded-xl"
            style={{ aspectRatio: item.ratio ?? "16 / 10" }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={
                item.wide
                  ? "(max-width: 1024px) 100vw, 960px"
                  : columns === 3
                    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    : "(max-width: 640px) 100vw, 50vw"
              }
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
  );
}
