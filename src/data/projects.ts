export type ProjectLink = {
  label: string;
  href: string;
  kind: "live" | "code" | "phone";
};

export type MediaItem = {
  src: string;
  alt: string;
  caption?: string;
  /** Rendered wide (spans the full gallery width) rather than in the 2 up grid. */
  wide?: boolean;
  /**
   * The image's own aspect ratio, as a CSS aspect-ratio value. Set it whenever
   * the file is not 16:10, so the frame matches the image and nothing is
   * cropped away.
   */
  ratio?: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  /** One line that has to land on its own, on the card. */
  hook: string;
  category: string;
  year: string;
  status: "Live in production" | "Shipped" | "Running locally";
  /** Two or three sentences: what it is, for whom, why it matters. */
  summary: string[];
  /** Big numbers for the case study header. */
  metrics: { value: string; label: string }[];
  /** What's included in the project, the substance recruiters scan. */
  features: { title: string; body: string }[];
  /** How it's built, as a left to right flow. */
  architecture: { title: string; body: string }[];
  stack: { group: string; items: string[] }[];
  links: ProjectLink[];
  /** Card image on the home page. */
  cover?: string;
  /** Drawn illustration used when a project has no interface to photograph. */
  illustration?: "dm-flow";
  coverAlt: string;
  /** A live, scrollable embed of the real site, shown instead of a still. */
  embed?: { url: string; label: string; note: string };
  gallery: MediaItem[];
  video?: {
    /** Muted looping preview used on the flagship card. */
    preview?: string;
    previewWebm?: string;
    poster?: string;
    /** Full commercial, click to play on the case study page. */
    full?: string;
    fullLabel?: string;
  };
  /** Accent hue used for this project's glow. */
  accent: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "automa",
    name: "AUTOMA",
    tagline: "Talk to your car. It listens.",
    hook: "A complete product launch: a cinematic site, a voice agent that answers a real phone number and places real orders, and the automation backbone behind it.",
    category: "Voice AI · Automation · Ad creative",
    year: "2026",
    status: "Live in production",
    summary: [
      "AUTOMA is an AI car brain, a device that plugs into a car's OBD port and turns climate, navigation, media and diagnostics into a conversation. I built the entire package around it: the landing experience, the AI sales agent, the order and inventory system, and the commercial.",
      "The centrepiece is a sales agent a customer can either talk to on the website or phone directly on an Israeli number. It is the same agent in both places, and it is not a demo. It reads live warehouse stock, places real orders, books pricing meetings with a calendar invite attached, captures leads, and queues human callbacks.",
      "Behind it sits an operations layer of eleven automations covering customers, the sales team, and inventory: order confirmations, shipping and delivery mail, referral rewards, reminders about stale leads, stock deduction with warehouse relocation, alerts when stock runs low, and a Monday inventory digest.",
    ],
    metrics: [
      { value: "278", label: "frames in the scroll cinematic" },
      { value: "5", label: "live tools the agent can call" },
      { value: "11", label: "operational automations" },
      { value: "1", label: "real phone number" },
    ],
    features: [
      {
        title: "A cinematic hero driven by scroll",
        body: "A sequence of 278 images painted to a canvas scaled for the display's pixel density, scrubbed by scroll position, with prioritised concurrent preloading so the first frame is instant and the rest stream in behind it.",
      },
      {
        title: "A voice sales agent on web and phone",
        body: "An ElevenLabs conversational agent embedded in the page with a live transcript, and the same agent wired to a Twilio number so a customer can simply call and buy.",
      },
      {
        title: "Agent tools that write to production",
        body: "Five secured webhook endpoints: live stock for each warehouse phrased for speech, real order placement with stock deduction and deduplication, meeting booking that emails a calendar invite, lead capture, and a queue for human callbacks.",
      },
      {
        title: "Eleven operational automations",
        body: "Order confirmation, shipped and delivered mail carrying a setup guide, a follow up after three days, a referral welcome gift and a reward for the referrer, alerts to the team on every new order, daily reminders about stale orders and leads, automatic stock deduction with warehouse relocation and compensation, alerts when stock runs low or critical, and a weekly inventory digest.",
      },
      {
        title: "Agent provisioning in one command",
        body: "An idempotent script that creates the API secret, uploads the knowledge base, registers every webhook tool and builds the agent itself, so the whole voice stack can be rebuilt from scratch in a single command.",
      },
      {
        title: "A commercial generated with AI",
        body: "A full product film produced with generative video tooling, embedded as a section that plays itself the moment it enters view, with a fallback for anyone who prefers reduced motion.",
      },
      {
        title: "Airtable as the operations console",
        body: "Orders, leads and inventory for each warehouse live in an Airtable base whose stage automations fire webhooks back into the app, so the side of the business that does not write code runs from a spreadsheet view.",
      },
      {
        title: "Tested and instrumented",
        body: "Playwright specs covering the whole journey including a live order run, Open Graph imagery generated at the edge, sitemap and robots routes, and Search Console verification.",
      },
    ],
    architecture: [
      { title: "Customer", body: "Arrives on the site, or dials the Israeli phone number." },
      {
        title: "Voice agent",
        body: "One ElevenLabs agent, grounded on the product FAQ and spec sheet, serving both channels.",
      },
      {
        title: "Secured webhooks",
        body: "Five authenticated route handlers the agent may call mid conversation.",
      },
      {
        title: "Airtable and mail",
        body: "Orders and stock written to Airtable. Confirmations, invites and alerts dispatched by email.",
      },
    ],
    stack: [
      {
        group: "Front end",
        items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Canvas"],
      },
      {
        group: "Agent and voice",
        items: ["ElevenLabs Conversational AI", "Twilio", "Webhook tools", "Knowledge base"],
      },
      {
        group: "Data and delivery",
        items: ["Airtable", "Resend", "Nodemailer", "Calendar invites"],
      },
      { group: "Quality and ops", items: ["Playwright", "ESLint", "Vercel"] },
    ],
    links: [
      { label: "Visit driveautoma.vercel.app", href: "https://driveautoma.vercel.app", kind: "live" },
    ],
    cover: "/screenshots/automa-product.webp",
    coverAlt: "The AUTOMA product page, with the device and its circuit brain lit",
    embed: {
      url: "https://driveautoma.vercel.app",
      label: "driveautoma.vercel.app",
      note: "The real site, running here. Scroll inside the frame to drive the cinematic.",
    },
    gallery: [
      {
        src: "/screenshots/automa-agent.webp",
        alt: "The AUTOMA FAQ section with the voice agent widget offering to start a call",
        caption: "The voice agent, live on the page and one tap from a call.",
      },
      {
        src: "/screenshots/automa-film.webp",
        alt: "A frame of the AUTOMA commercial playing inside the product page",
        caption: "The commercial, embedded and playing as it comes into view.",
      },
    ],
    video: {
      preview: "/media/automa-preview.mp4",
      previewWebm: "/media/automa-preview.webm",
      poster: "/media/automa-poster.jpg",
      full: "/media/automa-commercial.mp4",
      fullLabel: "Watch the AUTOMA commercial",
    },
    accent: "#66e3ff",
    featured: true,
  },

  {
    slug: "poker-splitter",
    name: "Poker Splitter",
    tagline: "Split the pot, keep the peace.",
    hook: "Photograph your chip stack and an AI counts it, then the app works out the fewest possible transfers to settle the whole table.",
    category: "Computer vision · Realtime · iOS",
    year: "2026",
    status: "Live in production",
    summary: [
      "Poker night always ends the same way: everyone counting chips, arguing about buy ins, and sending eleven separate payments. Poker Splitter removes all three problems.",
      "One player opens a room and the rest join by scanning a QR code. Buy ins and rebuys are tracked live on a virtual felt that rotates so every player sees themselves at the bottom. At the end, each player photographs their stack, a vision model counts the chips by denomination, and the app computes the smallest number of money transfers needed to settle everyone up.",
      "It ships twice: as a static web app on Firebase, and as a complete native SwiftUI application for iOS.",
    ],
    metrics: [
      { value: "2", label: "full builds, web and iOS" },
      { value: "AI", label: "chip counting from a photo" },
      { value: "min", label: "transfers to settle the table" },
      { value: "QR", label: "join, no account needed" },
    ],
    features: [
      {
        title: "A camera that counts chips",
        body: "Point a phone at the chips and a Gemini vision model counts them, reasoning step by step over the stack edge lines and checking itself against the room's chip denominations before returning a total.",
      },
      {
        title: "Settlement in the fewest transfers",
        body: "A greedy debt simplification reduces a table of winners and losers to the smallest possible set of payments, implemented as a pure, testable function.",
      },
      {
        title: "A live table from your own seat",
        body: "The felt renders from each player's own point of view, with their seat always at the bottom, and updates in realtime through Firestore as buy ins and rebuys land.",
      },
      {
        title: "Join by QR, even mid game",
        body: "A six character room code and a QR invite. Latecomers can join a game already in progress, and players can rebuy themselves without bothering the host.",
      },
      {
        title: "End game entry that always reconciles",
        body: "Final amounts are editable and the last player's total is calculated from the pot, so the numbers can never fail to add up.",
      },
      {
        title: "A settlement card worth sharing",
        body: "The result is rendered as a shareable card with the game image and stats, complete with a confetti finish.",
      },
      {
        title: "A native iOS twin",
        body: "A parallel SwiftUI application: twenty five Swift files across seven screens, built on iOS 17 observation and NavigationStack.",
      },
      {
        title: "Chips drawn, not photographed",
        body: "Poker chips, stacks and a denomination picker drawn as components, plus twelve preset avatars with duplicate prevention for players who would rather not upload a photo.",
      },
    ],
    architecture: [
      { title: "Host", body: "Creates a room. A six character code and QR invite are generated." },
      {
        title: "Players",
        body: "Join on their own phones. Buy ins and rebuys sync live through Firestore.",
      },
      { title: "Vision", body: "Each stack is photographed and counted by a Gemini vision model." },
      {
        title: "Settlement",
        body: "The debt graph is simplified to the fewest possible transfers, then shared.",
      },
    ],
    stack: [
      {
        group: "Web app",
        items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Static export"],
      },
      { group: "Backend", items: ["Firebase Firestore", "Cloud Functions", "Firebase Hosting"] },
      { group: "AI", items: ["Gemini vision", "Prompted step by step counting"] },
      { group: "Mobile", items: ["SwiftUI", "iOS 17", "NavigationStack"] },
    ],
    links: [
      { label: "Open the live app", href: "https://poker-splitter.web.app", kind: "live" },
    ],
    cover: "/screenshots/poker-create.webp",
    coverAlt: "Poker Splitter room creation, with avatars, buy in and chip values",
    gallery: [
      {
        src: "/screenshots/poker-create-tall.webp",
        alt: "Poker Splitter room creation: name, twelve preset avatars, buy in and chip denominations",
        caption:
          "Room setup: twelve preset avatars, a buy in, and the chip denominations the vision model will count against.",
        ratio: "760 / 1040",
      },
      {
        src: "/screenshots/poker-room-tall.webp",
        alt: "A live Poker Splitter room showing the six character code, share and QR buttons, and the player list",
        caption:
          "The lobby: a six character code, a QR invite, and players appearing live as they join.",
        ratio: "760 / 1040",
      },
    ],
    accent: "#7fe38f",
  },

  {
    slug: "jobscout",
    name: "JobScout",
    tagline: "Your resume, matched against everything.",
    hook: "Upload a resume and Claude scores thousands of live job postings from 0 to 100 with reasons, plus the gaps, a cover letter, and a daily digest of only what is new.",
    category: "AI platform · Full stack · Bilingual",
    year: "2026",
    status: "Live in production",
    summary: [
      "JobScout is an AI job matching platform built for the Israeli market, in Hebrew and English with full right to left support. A candidate uploads a resume, as a PDF, a Word file, or even a photograph of one, and it is parsed into a structured profile.",
      "It then scans thousands of live postings pulled from six different sources and has Claude score every one from 0 to 100, with an explicit explanation of why the candidate matches and what is missing. The result is a ranked dashboard with gap analysis, generated cover letters in each job's own language, and a daily digest containing only genuinely new matches.",
      "Its edge is where it looks. Five public applicant tracking APIs surface roles that never reach the big boards, and it reaches LinkedIn and Indeed postings indirectly through aggregation rather than scraping them, which keeps it on the right side of their terms.",
    ],
    metrics: [
      { value: "6", label: "job sources aggregated" },
      { value: "Thousands", label: "of live jobs scanned across the market" },
      { value: "0 to 100", label: "AI match score, with reasons" },
      { value: "4.2k", label: "lines of Python across 33 modules" },
    ],
    features: [
      {
        title: "Resume parsing, photographs included",
        body: "PDF and Word documents are parsed directly. A photographed resume is read with offline Windows OCR and Claude vision, then extracted into a structured candidate profile.",
      },
      {
        title: "A score from 0 to 100, explained",
        body: "Every posting is scored by Claude with a written rationale: why the candidate fits, and precisely which requirements they are missing.",
      },
      {
        title: "Six sources, thousands of postings",
        body: "Greenhouse, Lever, Ashby, Comeet and SmartRecruiters public APIs surface roles direct from company boards, while a Google for Jobs aggregator reaches LinkedIn, Indeed, AllJobs and Drushim without scraping them.",
      },
      {
        title: "Works with no API key at all",
        body: "The whole platform runs offline on a bilingual parser and scorer built from heuristics, and silently upgrades itself to Claude the moment an API key appears in the environment.",
      },
      {
        title: "A matching engine in two languages",
        body: "A dedicated bilingual layer handles role titles, seniority and prefiltering across Hebrew and English, with an interface that lays out right to left.",
      },
      {
        title: "Skill gauges you can turn",
        body: "Click a skill and set your years of experience on a circular gauge. The next search reweights its ranking accordingly.",
      },
      {
        title: "Cover letters and tailoring advice",
        body: "A generated cover letter in the language of each posting, plus specific advice on how to adjust the resume for that particular role.",
      },
      {
        title: "Monetisation, built in honestly",
        body: "A self serve sponsored ads system with click and impression statistics and a public page for advertisers, designed so a paid slot can never masquerade as a ranked match.",
      },
      {
        title: "Analytics that collect nothing",
        body: "No third party tracker, no cookies and no stored IP addresses. Visitors are hashed with a salt that rotates at midnight, candidate pages use unguessable tokens instead of accounts, and the expensive endpoints are rate limited by IP.",
      },
    ],
    architecture: [
      {
        title: "Resume in",
        body: "A PDF, a Word file or a photo, parsed by OCR and Claude vision into a profile.",
      },
      { title: "Scan", body: "Six connectors pull thousands of live postings from ATS APIs and job aggregation." },
      { title: "Score", body: "Claude rates every posting from 0 to 100 with match reasons and gaps." },
      {
        title: "Deliver",
        body: "A ranked dashboard, cover letters, and a daily digest of new matches only.",
      },
    ],
    stack: [
      { group: "Backend", items: ["FastAPI", "Uvicorn", "SQLAlchemy", "SQLite", "Jinja2"] },
      { group: "AI", items: ["Claude API", "Claude vision", "Offline fallback scorer"] },
      {
        group: "Sources",
        items: ["Greenhouse", "Lever", "Ashby", "Comeet", "SmartRecruiters", "JSearch"],
      },
      { group: "Extraction", items: ["PDF parsing", "Word parsing", "Windows OCR"] },
      { group: "Quality and ops", items: ["pytest", "Railway", "SMTP digests"] },
    ],
    links: [{ label: "Source on GitHub", href: "https://github.com/aviakon/jobscout", kind: "code" }],
    cover: "/screenshots/jobscout-landing.webp",
    coverAlt: "The JobScout landing page in Hebrew, laid out right to left",
    gallery: [
      {
        src: "/screenshots/jobscout-landing.webp",
        alt: "JobScout landing page in Hebrew with an aurora background and four feature cards",
        caption:
          "The landing page: Hebrew, right to left, and drawn entirely in CSS so it loads with no external requests.",
        wide: true,
      },
      {
        src: "/screenshots/jobscout-start.webp",
        alt: "JobScout resume upload step offering file, text, photo and link options",
        caption:
          "Step one: a resume as a file, pasted text, a link, or a photograph read by OCR and Claude vision.",
      },
    ],
    accent: "#a78bfa",
  },

  {
    slug: "jewelry-ig-bot",
    name: "Jewelry DM Engine",
    tagline: "Comment a word. Get a DM in seconds.",
    hook: "A production Instagram automation for a real jewelry brand. Comment a keyword on a post and the bot sends a private message with the offer within seconds, then replies publicly.",
    category: "Marketing automation · Meta API",
    year: "2026",
    status: "Live in production",
    summary: [
      "Built for konfinojewelry.com, a real jewelry business. When a follower comments a trigger word on a post, the bot sends them a private message within seconds, carrying the discount code, the shop link, the WhatsApp thread, and posts a short public reply so everyone else watching knows to comment too.",
      "That mechanic is the highest converting play on Instagram, and it only works if it is instant and never misfires. So the interesting engineering is all in reliability: webhooks verified by signature, keyword matching in two languages on word boundaries, which fixed early false positives, a layer that guarantees nobody is ever messaged twice, and tokens that refresh themselves every sixty days and persist to disk so a restart never silently breaks authentication.",
      "The most important design decision was not a technical one. Every keyword and reply lives in a plain JSON file that reloads live. The shop owner rewrites the campaign herself, and nothing is redeployed.",
    ],
    metrics: [
      { value: "~330", label: "lines doing production work" },
      { value: "2", label: "dependencies, by choice" },
      { value: "60d", label: "token rotation, automatic" },
      { value: "HE/EN", label: "keyword matching in two languages" },
    ],
    features: [
      {
        title: "Comment to DM in seconds",
        body: "A Meta webhook fires the moment a comment lands. The bot sends a private reply with the offer and posts a short public acknowledgement under the comment.",
      },
      {
        title: "The owner edits the campaign, not the code",
        body: "Keywords, message copy and public replies all live in a JSON rules file that reloads live, so the shop owner changes a campaign without a developer and without a redeploy.",
      },
      {
        title: "Matching on word boundaries, in two languages",
        body: "Hebrew and English triggers tokenised on word boundaries, after an early version proved that naive substring matching fires on the wrong comments.",
      },
      {
        title: "Signed webhooks",
        body: "Every incoming request is verified against Meta's signature using a captured raw body, so nothing but Instagram can drive the bot.",
      },
      {
        title: "Nobody is ever messaged twice",
        body: "A deduplication layer tracks handled comments, which matters more than it sounds when Meta redelivers webhooks.",
      },
      {
        title: "Authentication that heals itself",
        body: "Tokens are refreshed automatically before their sixty day expiry and persisted to disk, so a restart or a redeploy never drops the integration.",
      },
      {
        title: "Passed Meta App Review",
        body: "Including the public privacy policy page the platform requires, served by the bot itself, plus a 7,000 word setup guide written so somebody who does not write code could complete the Meta app configuration.",
      },
      {
        title: "Free to run, always awake",
        body: "Deployed on a free tier with an external pinger defeating idle sleep, so the whole system costs nothing to operate.",
      },
    ],
    architecture: [
      { title: "Follower", body: "Comments a trigger keyword on an Instagram post." },
      {
        title: "Signed webhook",
        body: "Meta delivers the event, and its signature is verified before anything runs.",
      },
      {
        title: "Rules engine",
        body: "Matched on word boundaries, in two languages, against a rules file that reloads live.",
      },
      {
        title: "Reply",
        body: "A private message with the offer, plus a short public reply under the comment.",
      },
    ],
    stack: [
      { group: "Runtime", items: ["Node.js", "Express", "Two dependencies total"] },
      {
        group: "Platform",
        items: ["Instagram Graph API v23", "Private replies", "Comment replies", "Signature verification"],
      },
      { group: "Ops", items: ["Render", "UptimeRobot keep alive", "Automatic token rotation"] },
    ],
    // The repository is private, since it holds a real client's campaign copy,
    // so there is nothing public to link to here.
    links: [],
    illustration: "dm-flow",
    coverAlt:
      "A diagram of the comment to DM flow: a keyword comment triggers a private message and a public reply",
    gallery: [],
    accent: "#f9a8d4",
  },

  {
    slug: "work-continuity-agent",
    name: "Work Continuity Agent",
    tagline: "It holds the thread of your work.",
    hook: "A desktop AI agent that watches how your day actually goes, then tells you where you were when you get interrupted. Everything stays on your machine.",
    category: "Desktop agent · Systems · Privacy",
    year: "2026",
    status: "Shipped",
    summary: [
      "Every interruption costs the twenty minutes it takes to remember what you were doing. This agent removes that cost. It snapshots your working context every sixty seconds, taking in the active window, everything else that is open, browser tabs, shell history and your own notes, notices when you have been pulled away, and hands you a short briefing on where you were when you come back.",
      "It also tracks open loops. Commitments you made in a note, a sent email or a Slack message, the sort that begin with “I'll send that Friday”, are extracted and followed until they close, and the day ends with a summary of what is done, open and blocked.",
      "It is built directly on the Windows system layer. The tray icon, the global hotkey, the window enumeration, the browser tab reading over COM automation and the Claude client are all hand built rather than pulled off a shelf, which is what lets the whole thing run as a single quiet process on your own machine.",
    ],
    metrics: [
      { value: "60s", label: "context capture interval" },
      { value: "14", label: "commands in the CLI" },
      { value: "5", label: "context sources tracked" },
      { value: "100%", label: "local: no server, no telemetry" },
    ],
    features: [
      {
        title: "Briefings after an interruption",
        body: "When you return from being pulled away, a short briefing reconstructs what you were doing, what you had open, and what you had just been about to do.",
      },
      {
        title: "Open loops, tracked until they close",
        body: "Commitments are extracted from notes, from sent mail scanned over IMAP, and from Slack messages, then followed until they are actually closed.",
      },
      {
        title: "Capture from anywhere with a hotkey",
        body: "Ctrl+Alt+Space from inside any application snapshots the current state and prompts for a one line note. If the note reads like a promise, it becomes a tracked open loop.",
      },
      {
        title: "Privacy as an architectural choice",
        body: "Local only, no server, no sync, no telemetry. API keys, email addresses and card numbers are redacted by pattern before anything is written to disk or sent to a model. Forgetting everything means deleting one folder.",
      },
      {
        title: "Built on the Windows system layer",
        body: "Window enumeration, idle detection, the system tray icon, the message pump, COM based UI automation for browser tabs and the Claude client are all built directly against the platform, so the agent runs as one small process with nothing else to install.",
      },
      {
        title: "Tab reading that cannot take it down",
        body: "Browser tab titles are read through UI Automation in an isolated subprocess, so a COM failure can never crash the agent, with an optional DevTools path for titles plus URLs.",
      },
      {
        title: "Works offline, upgrades silently",
        body: "Briefings and digests are generated from heuristics with no API key present, and switch to Claude the moment one is configured, picked up live and without a restart.",
      },
      {
        title: "A daily digest and a weekly mirror",
        body: "A summary of what is done, open and blocked at the end of each day, and a weekly view showing where the time actually went.",
      },
    ],
    architecture: [
      {
        title: "Capture",
        body: "Windows APIs snapshot windows, tabs and idle state every sixty seconds.",
      },
      { title: "Redact", body: "Secrets and personal data are stripped by pattern before storage." },
      {
        title: "Store",
        body: "Everything is written to a local SQLite file that never leaves the machine.",
      },
      {
        title: "Brief",
        body: "Claude, or an offline fallback, turns the timeline into a readable briefing.",
      },
    ],
    stack: [
      { group: "Language", items: ["Python 3.11"] },
      {
        group: "System",
        items: ["Win32 APIs", "COM UI Automation", "Tray and global hotkey", "SQLite"],
      },
      { group: "AI", items: ["Claude API", "Offline fallback"] },
      { group: "Sources", items: ["IMAP sent mail", "Slack Web API", "Shell history", "Browser tabs"] },
    ],
    links: [],
    cover: "/screenshots/wca-report.webp",
    coverAlt: "The Work Continuity Agent report, with open loops and generated briefings",
    gallery: [
      {
        src: "/screenshots/wca-report.webp",
        alt: "The Work Continuity Agent report showing snapshot counts, an open loop, and a generated daily digest",
        caption:
          "The local report from a real session: snapshot counts, a tracked open loop, and the digest it wrote at the end of the day. Generated on the machine, never uploaded.",
        wide: true,
        ratio: "1600 / 1045",
      },
    ],
    accent: "#ffb86b",
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);

export const featuredProject = projects.find((project) => project.featured)!;
export const otherProjects = projects.filter((project) => !project.featured);

/** Headline numbers for the proof strip on the home page. */
export const proofStats = [
  { value: 5, suffix: "", label: "products shipped end to end" },
  { value: 3, suffix: "", label: "live in production today" },
  { value: 11, suffix: "", label: "automations in one product" },
  { value: 1, suffix: "", label: "voice agent on a real phone line" },
];
