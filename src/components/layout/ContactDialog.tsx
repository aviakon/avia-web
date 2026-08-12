"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/data/site";

type Row = {
  label: string;
  value: string;
  href: string;
  /** What lands on the clipboard, which is not always what is displayed. */
  copy: string;
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard blocked; the link beside it still works */
        }
      }}
      className="border-hairline text-ink-muted hover:border-accent/50 hover:text-accent shrink-0 rounded-md border px-2.5 py-1.5 font-mono text-[12px] tracking-wider uppercase transition-colors"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

export function ContactDialog() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  const rows: Row[] = [
    ...(site.phone
      ? [
          {
            label: "Phone",
            value: site.phoneDisplay,
            href: `tel:${site.phone}`,
            copy: site.phoneDisplay,
          },
        ]
      : []),
    {
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
      copy: site.email,
    },
  ];

  // Escape closes, the page behind stops scrolling, and focus moves into the
  // dialog and back to the button that opened it.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeButton.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={opener}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="edge bg-surface hover:border-accent/50 hover:text-accent min-h-11 rounded-md px-4 py-2.5 text-sm font-medium transition-colors"
      >
        Get in touch
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div
              className="bg-void/70 absolute inset-0 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-dialog-title"
              initial={reduced ? false : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="edge bg-surface glow-accent relative w-full max-w-md rounded-2xl p-7 sm:p-8"
            >
              <button
                ref={closeButton}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-ink-muted hover:text-ink absolute top-4 right-4 rounded-md px-2 py-1 text-lg leading-none transition-colors"
              >
                ×
              </button>

              <p className="text-accent font-mono text-[12px] tracking-[0.2em] uppercase">
                Get in touch
              </p>
              <h2
                id="contact-dialog-title"
                className="font-display mt-3 text-3xl tracking-tight"
              >
                {site.name}
              </h2>
              <p className="text-ink-muted mt-1 text-sm">
                {site.role} · {site.location}
              </p>

              <ul className="mt-7 space-y-3">
                {rows.map((row) => (
                  <li
                    key={row.label}
                    className="border-hairline bg-canvas/40 flex items-center gap-3 rounded-xl border p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-ink-muted font-mono text-[12px] tracking-widest uppercase">
                        {row.label}
                      </p>
                      <a
                        href={row.href}
                        className="text-ink hover:text-accent mt-1 block truncate text-[15px] font-medium transition-colors"
                        dir="ltr"
                      >
                        {row.value}
                      </a>
                    </div>
                    <CopyButton value={row.copy} />
                  </li>
                ))}
              </ul>

              <p className="text-ink-muted mt-6 text-[13px] leading-relaxed">
                Email is the fastest way to reach me. I read everything.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
