/**
 * The headline is authored as the two lines it should break into, so the shape
 * of it is a decision rather than an accident of the container width.
 */
export const headlineLines = [
  "Products that think, speak,",
  "and sell themselves.",
] as const;

export const site = {
  name: "Avia Konfino",
  initials: "AK",
  role: "AI Product Engineer",
  headline: headlineLines.join(" "),
  subline:
    "Voice agents that answer a real phone line. Automations that run a business while nobody is watching. Cinematic ad creative generated end to end. Five products shipped, three of them live in production.",
  shortBio:
    "I design and ship complete AI products: the interface, the agent behind it, the automations that keep it running, and the marketing that sells it. Most of it is built with Claude Code as my development environment, which is how one person covers that much surface area.",
  email: "avia.konfino@gmail.com",
  /**
   * Shown in the Get in touch dialog. Leave both empty and the phone row is
   * simply not rendered, rather than showing a placeholder. The dialled number
   * carries the country code so the link works from outside Israel too, while
   * the display keeps the local form.
   */
  phone: "+972533311184",
  phoneDisplay: "053 331 1184",
  github: "https://github.com/aviakon",
  githubHandle: "aviakon",
  location: "Israel",
  url: "https://aviakonfino.vercel.app",
  seoTitle: "Avia Konfino · AI Product Engineer",
  seoDescription:
    "Portfolio of Avia Konfino: voice AI agents, business automations, AI generated video, and full stack products built with Claude Code. Five shipped projects, three live in production.",
} as const;

export const navLinks = [
  { label: "Work", href: "/#work" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;
