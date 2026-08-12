import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { MediaItem } from "@/data/projects";

type GalleryGridProps = {
  items: MediaItem[];
  /** Columns the grid lays out in on a wide screen. Three suits phone shots. */
  columns?: 2 | 3;
};

/**
 * Turns a "1600 / 1045" ratio string into the intrinsic dimensions Next needs.
 * Passing real width and height and letting the height stay auto means the
 * rendered box always matches the image exactly, so nothing is ever cropped or
 * letterboxed by a frame that disagrees with the file.
 */
export function intrinsic(ratio: string | undefined): { width: number; height: number } {
  const [width, height] = (ratio ?? "1600 / 1000").split("/").map((n) => Number(n.trim()));
  return Number.isFinite(width) && Number.isFinite(height) && height > 0
    ? { width, height }
    : { width: 1600, height: 1000 };
}

/**
 * A grid of screenshots with captions. Used both for a project's "Look at it"
 * section and, for projects whose product is a sequence of screens rather than
 * one page, as the lead visual itself.
 */
export function GalleryGrid({ items, columns }: GalleryGridProps) {
  return (
    <div
      className={`grid gap-4 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}
    >
      {items.map((item, itemIndex) => {
        const { width, height } = intrinsic(item.ratio);

        return (
          <Reveal
            key={item.src}
            delay={itemIndex * 0.05}
            as="figure"
            className={item.wide ? "sm:col-span-2" : undefined}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={width}
              height={height}
              sizes={
                item.wide
                  ? "(max-width: 1024px) 100vw, 960px"
                  : columns === 3
                    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    : "(max-width: 640px) 100vw, 50vw"
              }
              className="edge h-auto w-full rounded-xl"
            />
            {item.caption && (
              <figcaption className="text-ink-muted mt-2.5 text-[13px] leading-relaxed">
                {item.caption}
              </figcaption>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
