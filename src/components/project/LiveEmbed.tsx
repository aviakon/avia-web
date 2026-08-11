"use client";

import { useEffect, useRef, useState } from "react";

type LiveEmbedProps = {
  url: string;
  /** Shown in the address bar of the surrounding chrome. */
  label: string;
  note: string;
  accent: string;
};

/**
 * The size the embedded page is laid out at, before being scaled to fit.
 * A narrow container gets a narrower layout, so the scale stays gentle enough
 * for the page to still be readable on a phone.
 */
const layoutFor = (containerWidth: number) =>
  containerWidth >= 700 ? { w: 1440, h: 900 } : { w: 1024, h: 760 };

/**
 * The real site, running inside a scaled browser frame. The iframe is laid out
 * at desktop width and scaled down with a transform, so the embedded page
 * renders its desktop layout rather than collapsing to a phone breakpoint,
 * while still fitting the column here.
 *
 * It stays behind a click: an iframe of a page carrying a 278 frame image
 * sequence is not something to load for a visitor who never scrolls this far.
 */
export function LiveEmbed({ url, label, note, accent }: LiveEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const [frame, setFrame] = useState({ w: 1440, h: 900, scale: 0.6 });
  const shell = useRef<HTMLDivElement>(null);

  // Keep the scaled page exactly as wide as its container at every breakpoint,
  // so there is never a strip of empty frame beside it.
  useEffect(() => {
    const node = shell.current;
    if (!node) return;

    const measure = () => {
      const width = node.clientWidth;
      const { w, h } = layoutFor(width);
      setFrame({ w, h, scale: width / w });
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure>
      <div className="edge bg-surface/60 overflow-hidden rounded-2xl">
        {/* Browser chrome */}
        <div className="border-hairline flex items-center gap-2 border-b px-4 py-2.5">
          <span className="bg-hairline-strong size-2.5 rounded-full" />
          <span className="bg-hairline-strong size-2.5 rounded-full" />
          <span className="bg-hairline-strong size-2.5 rounded-full" />
          <span className="bg-canvas/70 text-ink-muted ml-3 flex-1 truncate rounded px-3 py-1 text-center font-mono text-[11px]">
            {label}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-ink-muted hover:text-accent shrink-0 font-mono text-[11px] transition-colors"
          >
            open ↗
          </a>
        </div>

        {/* Scaled viewport */}
        <div
          ref={shell}
          className="relative w-full overflow-hidden bg-black"
          style={{ height: frame.h * frame.scale }}
        >
          {loaded ? (
            <iframe
              src={url}
              title={`${label}, running live`}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
              className="absolute top-0 left-0 origin-top-left border-0"
              style={{
                width: frame.w,
                height: frame.h,
                transform: `scale(${frame.scale})`,
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
            >
              <span
                className="flex size-14 items-center justify-center rounded-full text-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: accent, color: "#07070b" }}
                aria-hidden
              >
                ↗
              </span>
              <span className="text-ink text-sm font-medium">Load the live site</span>
              <span className="text-ink-muted text-xs">
                It runs here, inside the frame. Scroll within it.
              </span>
            </button>
          )}
        </div>
      </div>

      <figcaption className="text-ink-muted mt-2.5 text-[13px] leading-relaxed">
        {note}
      </figcaption>
    </figure>
  );
}
