"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/site";
import { ContactDialog } from "./ContactDialog";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
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
                <Link
                  href={link.href}
                  className="text-ink-dim hover:text-ink hover:bg-surface rounded-md px-3 py-2 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ContactDialog />
        </div>
      </nav>
    </header>
  );
}
