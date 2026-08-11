export type SkillGroup = {
  id: string;
  title: string;
  blurb: string;
  items: string[];
  /** Where this capability is demonstrated, linking to a case study. */
  evidence: { label: string; slug: string }[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "agents",
    title: "AI Agents",
    blurb:
      "Conversational agents that do real work. Not chatbots that answer questions, but agents with tools that write to production systems.",
    items: [
      "ElevenLabs Conversational AI",
      "Claude API and tool use",
      "Gemini vision",
      "Webhook tool design",
      "Knowledge base grounding",
      "Voice, text and telephony",
    ],
    evidence: [
      { label: "The AUTOMA voice agent", slug: "automa" },
      { label: "Work Continuity Agent", slug: "work-continuity-agent" },
    ],
  },
  {
    id: "automation",
    title: "Automation and Integrations",
    blurb:
      "The unglamorous machinery that makes a product a business: orders, stock, alerts, follow ups, and escalation paths that fire without anyone pressing a button.",
    items: [
      "Airtable",
      "Twilio telephony",
      "Meta Graph API",
      "Resend and SMTP",
      "IMAP and Slack scanning",
      "Webhook orchestration",
      "Scheduled digests",
    ],
    evidence: [
      { label: "Eleven automations in AUTOMA", slug: "automa" },
      { label: "The Instagram DM engine", slug: "jewelry-ig-bot" },
    ],
  },
  {
    id: "creative",
    title: "AI Media and Marketing",
    blurb:
      "Ad creative, product film, and marketing copy produced with generative tooling, then engineered into the page as media that never costs a visitor anything.",
    items: [
      "Commercial video generated with AI",
      "Frame sequence cinematics",
      "Storytelling driven by scroll",
      "Brand and landing copy",
      "Conversion funnels",
      "Social and share assets",
    ],
    evidence: [
      { label: "The AUTOMA commercial", slug: "automa" },
      { label: "Jewelry brand content", slug: "jewelry-ig-bot" },
    ],
  },
  {
    id: "engineering",
    title: "Product Engineering",
    blurb:
      "Full stack delivery across web, backend, mobile and desktop. Shipped, deployed, and tested rather than left in a repository.",
    items: [
      "Next.js, React, TypeScript",
      "Tailwind CSS",
      "FastAPI and Python",
      "Firebase and Firestore",
      "SwiftUI for iOS",
      "Windows system APIs",
      "Playwright",
    ],
    evidence: [
      { label: "The JobScout platform", slug: "jobscout" },
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
