export type SkillGroup = {
  id: string;
  title: string;
  blurb: string;
  items: string[];
  /** Where this capability is demonstrated — links to a case study slug. */
  evidence: { label: string; slug: string }[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "agents",
    title: "AI Agents",
    blurb:
      "Conversational agents that do real work — not chatbots that answer questions, but agents with tools that write to production systems.",
    items: [
      "ElevenLabs Conversational AI",
      "Claude API / tool use",
      "Gemini vision",
      "Webhook tool design",
      "Knowledge-base grounding",
      "Voice + text + telephony",
    ],
    evidence: [
      { label: "AUTOMA voice agent", slug: "automa" },
      { label: "Work-Continuity Agent", slug: "work-continuity-agent" },
    ],
  },
  {
    id: "automation",
    title: "Automation & Integrations",
    blurb:
      "The unglamorous machinery that makes a product a business: orders, stock, alerts, follow-ups, and escalation paths that fire without anyone pressing a button.",
    items: [
      "Airtable",
      "Twilio telephony",
      "Meta Graph API",
      "Resend / SMTP",
      "IMAP + Slack scanning",
      "Webhook orchestration",
      "Scheduled digests",
    ],
    evidence: [
      { label: "11 automations in AUTOMA", slug: "automa" },
      { label: "Instagram DM engine", slug: "jewelry-ig-bot" },
    ],
  },
  {
    id: "creative",
    title: "AI Media & Marketing",
    blurb:
      "Ad creative, product film, and marketing copy produced with generative tooling, then engineered into the page as performance-safe media.",
    items: [
      "AI-generated commercial video",
      "Frame-sequence cinematics",
      "Scroll-driven storytelling",
      "Brand & landing copy",
      "Conversion funnels",
      "OG / social assets",
    ],
    evidence: [
      { label: "AUTOMA commercial", slug: "automa" },
      { label: "Jewelry brand content", slug: "jewelry-ig-bot" },
    ],
  },
  {
    id: "engineering",
    title: "Product Engineering",
    blurb:
      "Full-stack delivery across web, backend, mobile and desktop — shipped, deployed, and tested rather than left in a repo.",
    items: [
      "Next.js / React / TypeScript",
      "Tailwind CSS",
      "FastAPI / Python",
      "Firebase + Firestore",
      "SwiftUI (iOS)",
      "Win32 / ctypes",
      "Playwright e2e",
    ],
    evidence: [
      { label: "JobScout platform", slug: "jobscout" },
      { label: "Poker Splitter", slug: "poker-splitter" },
    ],
  },
];

/** Names that scroll in the capability marquee. */
export const toolMarquee = [
  "Claude Code",
  "Claude API",
  "ElevenLabs",
  "Gemini Vision",
  "Twilio",
  "Airtable",
  "Meta Graph API",
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "FastAPI",
  "Firebase",
  "SwiftUI",
  "Vercel",
  "Railway",
  "Render",
  "Playwright",
  "Resend",
  "SQLite",
];
