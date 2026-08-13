"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navLinks, site } from "@/data/site";
import { ContactDialog } from "./ContactDialog";

/** How long the mobile menu takes to collapse, in milliseconds. */
const MENU_EXIT_MS = 220;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the menu, and so does a tap anywhere outside the bar. The
  // panel is positioned inside the header rather than fixed to the viewport:
  // once scrolled the header carries a backdrop blur, which would make it the
  // containing block for any fixed child and anchor it to the bar instead.
  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  /**
   * These are anchors into the home page, so they are plain links rather than
   * router links. Routing a same page hash made the router replace the URL and
   * reset the scroll position in the same frame, which cancelled the scroll
   * that had just started. Here the scroll is done directly, and a visitor
   * arriving from a case study falls through to an ordinary navigation.
   */
  const goToSection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const hash = href.split("#")[1];
    const target =
      hash && window.location.pathname === "/"
        ? document.getElementById(hash)
        : null;

    if (target) {
      event.preventDefault();
      window.history.replaceState(null, "", `#${hash}`);

      // The menu's collapse animation swallows a scroll started while it runs,
      // so wait for it to finish. Closed already, this is the next frame.
      const wait = menuOpen && !reduced ? MENU_EXIT_MS + 40 : 0;
      window.setTimeout(
        () => target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }),
        wait,
      );
    }

    setMenuOpen(false);
  };

  return (
    <header
      ref={header}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "border-hairline bg-canvas/70 border-b backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <a
        href="#content"
        className="bg-accent text-void sr-only rounded px-3 py-2 text-sm font-medium focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="group -ml-2 flex min-h-11 items-center gap-2.5 px-2"
          aria-label={`${site.name}, home`}
        >
          <span className="border-hairline text-accent group-hover:border-accent/60 flex size-8 items-center justify-center rounded-md border font-mono text-[13px] tracking-tight transition-colors">
            {site.initials}
          </span>
          <span className="hidden text-sm font-medium tracking-tight sm:block">
            {site.name}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(event) => goToSection(event, link.href)}
                  className="text-ink-dim hover:text-ink hover:bg-surface flex min-h-11 items-center rounded-md px-3 text-sm transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <ContactDialog />

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="edge bg-surface hover:border-accent/50 flex size-11 items-center justify-center rounded-md transition-colors md:hidden"
          >
            {/* Two bars that cross into an X, so the button reads as a toggle. */}
            <span className="relative block h-3 w-4" aria-hidden>
              <span
                className={`bg-ink absolute left-0 block h-px w-4 transition-all duration-300 ${
                  menuOpen ? "top-1.5 rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`bg-ink absolute left-0 block h-px w-4 transition-all duration-300 ${
                  menuOpen ? "top-1.5 -rotate-45" : "top-2.5"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduced ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: MENU_EXIT_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
            className="border-hairline bg-canvas overflow-hidden border-t md:hidden"
          >
            <ul className="mx-auto max-w-6xl px-5 py-2 sm:px-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => goToSection(event, link.href)}
                    className="text-ink-dim hover:text-accent border-hairline flex min-h-14 items-center border-b text-[15px] transition-colors last:border-b-0"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
