export type ProjectLink = {
  label: string;
  href: string;
  kind: "live" | "code" | "phone";
};

export type MediaItem = {
  src: string;
  alt: string;
  caption?: string;
  /** Rendered wide (spans the full gallery width) rather than in the 2-up grid. */
  wide?: boolean;
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
  /** 2–3 sentences: what it is, for whom, why it matters. */
  summary: string[];
  /** Big numbers for the case-study header. */
  metrics: { value: string; label: string }[];
  /** What's included in the project — the substance recruiters scan. */
  features: { title: string; body: string }[];
  /** How it's built, as a left-to-right flow. */
  architecture: { title: string; body: string }[];
  stack: { group: string; items: string[] }[];
  links: ProjectLink[];
  /** Card image on the home page. */
  cover?: string;
  /** Drawn illustration used when a project has no interface to photograph. */
  illustration?: "dm-flow";
  coverAlt: string;
  gallery: MediaItem[];
  video?: {
    /** Muted looping preview used on the flagship card. */
    preview?: string;
    previewWebm?: string;
    poster?: string;
    /** Full commercial, click-to-play on the case-study page. */
    full?: string;
    fullLabel?: string;
  };
  /** Accent hue used for this project's glow, as an oklch-friendly hex. */
  accent: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "automa",
    name: "AUTOMA",
    tagline: "Talk to your car. It listens.",
    hook: "A complete product launch — cinematic site, a voice agent that answers a real phone number and places real orders, and the automation backbone behind it.",
    category: "Voice AI · Automation · Ad creative",
    year: "2026",
    status: "Live in production",
    summary: [
      "AUTOMA is an AI “car brain” — a device that plugs into a car's OBD port and turns climate, navigation, media and diagnostics into a conversation. I built the entire go-to-market package around it: the landing experience, the AI sales agent, the order and inventory system, and the commercial.",
      "The centrepiece is a sales agent a customer can either talk to on the website or phone directly on an Israeli number. It is the same agent in both places, and it is not a demo: it reads live warehouse stock, places real orders, books pricing meetings with a calendar invite attached, captures leads, and queues human callbacks.",
      "Behind it sits an operations layer of eleven automations covering customers, the sales team, and inventory — order confirmations, shipping and delivery mail, referral rewards, stale-lead reminders, stock deduction with warehouse relocation, low-stock alerts and a Monday inventory digest.",
    ],
    metrics: [
      { value: "278", label: "hand-scrubbed hero frames" },
      { value: "5", label: "live tools the agent can call" },
      { value: "11", label: "operational automations" },
      { value: "1", label: "real phone number" },
    ],
    features: [
      {
        title: "Scroll-driven cinematic hero",
        body: "A 278-frame image sequence painted to a DPR-scaled canvas and scrubbed by scroll position, with prioritised concurrent preloading so the first frame is instant and the rest stream in behind it.",
      },
      {
        title: "Voice sales agent on web and phone",
        body: "An ElevenLabs conversational agent embedded in the page with a live transcript, and the same agent wired to a Twilio number so a customer can simply call and buy.",
      },
      {
        title: "Agent tools that write to production",
        body: "Five secured webhook endpoints: live per-warehouse stock phrased for speech, real order placement with stock deduction and de-duplication, meeting booking that emails an .ics invite, lead capture, and a human-callback queue.",
      },
      {
        title: "Eleven ops automations",
        body: "Order confirmation, shipped and delivered mail with a setup guide, three-day follow-up, referral welcome gift and referrer reward, new-order team alerts, daily stale order and lead reminders, automatic stock deduction with warehouse relocation and compensation, low and critical stock alerts, and a weekly inventory digest.",
      },
      {
        title: "One-command agent provisioning",
        body: "An idempotent script that creates the API secret, uploads the knowledge base, registers every webhook tool and builds the agent itself — so the whole voice stack can be rebuilt from scratch in a single command.",
      },
      {
        title: "AI-generated commercial",
        body: "A full product film produced with generative video tooling, embedded as an auto-playing section with an IntersectionObserver trigger and a reduced-motion fallback.",
      },
      {
        title: "Airtable as the operations console",
        body: "Orders, leads and per-warehouse inventory live in an Airtable base whose stage automations fire webhooks back into the app, so the non-technical side of the business runs from a spreadsheet view.",
      },
      {
        title: "Tested and instrumented",
        body: "Playwright end-to-end specs including a live order run, edge-generated Open Graph imagery, sitemap and robots routes, and Search Console verification.",
      },
    ],
    architecture: [
      {
        title: "Customer",
        body: "Arrives on the site or dials the Israeli phone number.",
      },
      {
        title: "Voice agent",
        body: "One ElevenLabs agent, grounded on the product FAQ and spec sheet, serving both channels.",
      },
      {
        title: "Secured webhooks",
        body: "Five authenticated Next.js route handlers the agent may call mid-conversation.",
      },
      {
        title: "Airtable + mail",
        body: "Orders and stock written to Airtable; confirmations, invites and alerts dispatched by email.",
      },
    ],
    stack: [
      {
        group: "Front end",
        items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Canvas"],
      },
      {
        group: "Agent & voice",
        items: ["ElevenLabs Conversational AI", "Twilio", "Webhook tools", "Knowledge base"],
      },
      {
        group: "Data & delivery",
        items: ["Airtable", "Resend", "Nodemailer", "ICS calendar invites"],
      },
      { group: "Quality & ops", items: ["Playwright", "ESLint", "Vercel"] },
    ],
    links: [
      { label: "Visit driveautoma.vercel.app", href: "https://driveautoma.vercel.app", kind: "live" },
    ],
    cover: "/screenshots/automa-product.webp",
    coverAlt: "AUTOMA landing page — the AI car brain product site",
    gallery: [
      {
        src: "/screenshots/automa-product.webp",
        alt: "The AUTOMA device rendered on the product page, its circuit-brain lit",
        caption: "The order panel — the last beat of the scroll narrative.",
        wide: true,
      },
      {
        src: "/screenshots/automa-agent.webp",
        alt: "The AUTOMA FAQ section with the voice agent widget offering to start a call",
        caption: "The voice agent, live on the page and one tap from a call.",
      },
      {
        src: "/screenshots/automa-film.webp",
        alt: "A frame of the AUTOMA commercial playing inside the product page",
        caption: "The commercial, embedded and auto-playing in view.",
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
      "Poker night always ends the same way: everyone counting chips, arguing about buy-ins, and sending eleven separate payments. Poker Splitter removes all three problems.",
      "One player opens a room and the rest join by scanning a QR code. Buy-ins and rebuys are tracked live on a virtual felt that rotates so every player sees themselves at the bottom. At the end, each player photographs their stack — a vision model counts the chips by denomination — and the app computes the minimum number of money transfers needed to settle everyone up.",
      "It ships twice: as a static Next.js web app on Firebase, and as a complete native SwiftUI application for iOS.",
    ],
    metrics: [
      { value: "2", label: "full implementations (web + iOS)" },
      { value: "AI", label: "chip counting from a photo" },
      { value: "min", label: "transfers to settle the table" },
      { value: "QR", label: "join, no account needed" },
    ],
    features: [
      {
        title: "AI chip-stack camera",
        body: "Point a phone at the chips and a Gemini vision model counts them, reasoning over stack edge lines and self-verifying against the room's chip denominations before returning a total.",
      },
      {
        title: "Minimum-transfer settlement",
        body: "A greedy debt-simplification algorithm reduces a table of winners and losers to the smallest possible set of payments — implemented as a pure, testable function.",
      },
      {
        title: "Live table, per-player perspective",
        body: "The felt renders from each player's own point of view, with their seat always at the bottom, and updates in realtime through Firestore as buy-ins and rebuys land.",
      },
      {
        title: "Join by QR, mid-game",
        body: "A six-character room code and a QR invite. Latecomers can join a game already in progress, and players can rebuy themselves without bothering the host.",
      },
      {
        title: "Smart end-game entry",
        body: "Final amounts are editable and the last player's total is auto-calculated from the pot, so the numbers can never fail to reconcile.",
      },
      {
        title: "Shareable settlement card",
        body: "The result is rendered as a shareable card with the game image and stats, complete with a confetti finish.",
      },
      {
        title: "Native iOS twin",
        body: "A parallel SwiftUI application — twenty-five Swift files across seven screens, built on iOS 17 observation and NavigationStack.",
      },
      {
        title: "Custom chip rendering",
        body: "Poker chips, stacks and a denomination picker drawn as components, plus twelve preset avatars with duplicate prevention for players who don't want to upload a photo.",
      },
    ],
    architecture: [
      { title: "Host", body: "Creates a room; a six-character code and QR invite are generated." },
      { title: "Players", body: "Join on their own phones; buy-ins and rebuys sync live through Firestore." },
      { title: "Vision", body: "Each stack is photographed and counted by a Gemini vision model." },
      { title: "Settlement", body: "The debt graph is simplified to the fewest possible transfers and shared." },
    ],
    stack: [
      {
        group: "Web app",
        items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Static export"],
      },
      {
        group: "Backend",
        items: ["Firebase Firestore", "Cloud Functions", "Firebase Hosting"],
      },
      { group: "AI", items: ["Gemini vision", "Prompted chain-of-thought counting"] },
      { group: "Mobile", items: ["SwiftUI", "iOS 17", "NavigationStack"] },
    ],
    links: [
      { label: "Visit poker-splitter.web.app", href: "https://poker-splitter.web.app", kind: "live" },
    ],
    cover: "/screenshots/poker-create.webp",
    coverAlt: "Poker Splitter — creating a room with avatars, buy-in and chip values",
    gallery: [
      {
        src: "/screenshots/poker-create.webp",
        alt: "Poker Splitter room creation: name, twelve preset avatars, buy-in and chip denominations",
        caption: "Room setup — twelve preset avatars, buy-in, and the chip denominations the vision model will count against.",
      },
      {
        src: "/screenshots/poker-room.webp",
        alt: "A live Poker Splitter room showing the six-character code, share and QR buttons, and the player list",
        caption: "The lobby: a six-character code, a QR invite, and players appearing live as they join.",
      },
    ],
    accent: "#7fe38f",
  },

  {
    slug: "jobscout",
    name: "JobScout",
    tagline: "Your resume, matched against everything.",
    hook: "Upload a resume and Claude scores hundreds of live job postings 0–100 with reasons — plus the gaps, a cover letter, and a daily digest of only what's new.",
    category: "AI platform · Full-stack · Bilingual",
    year: "2026",
    status: "Live in production",
    summary: [
      "JobScout is an AI job-matching platform built for the Israeli market, in Hebrew and English with full right-to-left support. A candidate uploads a resume — PDF, Word, or even a photograph of one — and it is parsed into a structured profile.",
      "It then scans hundreds of live postings pulled from six different sources and has Claude score every one from 0 to 100, with an explicit explanation of why the candidate matches and what is missing. The result is a ranked dashboard with gap analysis, generated cover letters in each job's own language, and a daily digest containing only genuinely new matches.",
      "Its edge is where it looks: five public applicant-tracking APIs surface roles that never reach the big boards, seeded with sixty-six Israeli tech companies. It reaches LinkedIn and Indeed postings indirectly through aggregation rather than scraping them, which keeps it on the right side of their terms.",
    ],
    metrics: [
      { value: "6", label: "job sources aggregated" },
      { value: "66", label: "Israeli company boards seeded" },
      { value: "0–100", label: "AI match score, with reasons" },
      { value: "4.2k", label: "lines of Python across 33 modules" },
    ],
    features: [
      {
        title: "Resume parsing, including photographs",
        body: "PDF and Word documents are parsed directly; a photographed resume is read with offline Windows OCR and Claude vision, then extracted into a structured candidate profile.",
      },
      {
        title: "Explained 0–100 matching",
        body: "Every posting is scored by Claude with a written rationale — why the candidate fits and precisely which requirements they are missing.",
      },
      {
        title: "Six-source aggregation",
        body: "Greenhouse, Lever, Ashby, Comeet and SmartRecruiters public APIs surface roles direct from company boards, while a Google-for-Jobs aggregator reaches LinkedIn, Indeed, AllJobs and Drushim without scraping them.",
      },
      {
        title: "Works with no API key at all",
        body: "The whole platform runs offline on a heuristic bilingual parser and scorer, and silently upgrades itself to Claude the moment an API key appears in the environment.",
      },
      {
        title: "Hebrew / English matching engine",
        body: "A dedicated bilingual layer handles role titles, seniority and prefiltering across both languages, with a right-to-left interface.",
      },
      {
        title: "Interactive skill gauges",
        body: "Click a skill and set your years of experience on a circular gauge; the next search re-weights its ranking accordingly.",
      },
      {
        title: "Cover letters and tailoring tips",
        body: "A generated cover letter in the language of each posting, plus specific advice on how to adjust the resume for that particular role.",
      },
      {
        title: "Monetisation, built in honestly",
        body: "A self-serve sponsored-ads system with click and impression statistics and a public advertise page — designed so a paid slot can never masquerade as a ranked match.",
      },
      {
        title: "Privacy-first analytics",
        body: "No third-party tracker, no cookies and no stored IP addresses; visitors are hashed with a salt that rotates at midnight. Candidate pages use unguessable tokens instead of accounts, with per-IP rate limiting on the expensive endpoints.",
      },
    ],
    architecture: [
      { title: "Resume in", body: "PDF, Word or photo, parsed by OCR and Claude vision into a profile." },
      { title: "Scan", body: "Six connectors pull live postings from ATS APIs and job aggregation." },
      { title: "Score", body: "Claude rates every posting 0–100 with match reasons and gaps." },
      { title: "Deliver", body: "Ranked dashboard, cover letters, and a daily digest of new matches only." },
    ],
    stack: [
      { group: "Backend", items: ["FastAPI", "Uvicorn", "SQLAlchemy", "SQLite", "Jinja2"] },
      { group: "AI", items: ["Claude API", "Claude vision", "Heuristic fallback scorer"] },
      {
        group: "Sources",
        items: ["Greenhouse", "Lever", "Ashby", "Comeet", "SmartRecruiters", "JSearch"],
      },
      { group: "Extraction", items: ["pypdf", "python-docx", "WinOCR"] },
      { group: "Quality & ops", items: ["pytest", "Railway", "SMTP digests"] },
    ],
    links: [
      { label: "Source on GitHub", href: "https://github.com/aviakon/jobscout", kind: "code" },
    ],
    cover: "/screenshots/jobscout-landing.webp",
    coverAlt: "JobScout — the Hebrew right-to-left landing page for the AI job matching platform",
    gallery: [
      {
        src: "/screenshots/jobscout-landing.webp",
        alt: "JobScout landing page in Hebrew with an aurora background and four feature cards",
        caption: "The landing page — Hebrew, right-to-left, and entirely CSS-generated so it loads with no external requests.",
        wide: true,
      },
      {
        src: "/screenshots/jobscout-start.webp",
        alt: "JobScout resume upload step offering file, text, photo and link options",
        caption: "Step one: a resume as a file, pasted text, a link — or a photograph, read by OCR and Claude vision.",
      },
    ],
    accent: "#a78bfa",
  },

  {
    slug: "jewelry-ig-bot",
    name: "Jewelry DM Engine",
    tagline: "Comment a word. Get a DM in seconds.",
    hook: "A production Instagram automation for a real jewelry brand: comment a keyword on a post and the bot instantly sends a private DM with the offer, then replies publicly.",
    category: "Marketing automation · Meta API",
    year: "2026",
    status: "Live in production",
    summary: [
      "Built for konfinojewelry.com, a real jewelry business. When a follower comments a trigger word on a post, the bot sends them a private message within seconds — the discount code, the shop link, the WhatsApp thread — and posts a short public reply so everyone else watching knows to comment too.",
      "That mechanic is the highest-converting play on Instagram, and it only works if it is instant and never misfires. So the interesting engineering is all in reliability: HMAC-verified webhooks, bilingual whole-word keyword matching that fixed early false positives, a de-duplication layer so nobody is ever messaged twice, and automatic sixty-day token rotation persisted to disk so a restart never silently breaks authentication.",
      "The most important design decision was non-technical: every keyword and reply lives in a plain JSON file that hot-reloads. The shop owner rewrites the campaign herself, and nothing is redeployed.",
    ],
    metrics: [
      { value: "~330", label: "lines doing production work" },
      { value: "2", label: "npm dependencies, by choice" },
      { value: "60d", label: "token rotation, automatic" },
      { value: "HE/EN", label: "bilingual keyword matching" },
    ],
    features: [
      {
        title: "Comment-to-DM in seconds",
        body: "A Meta webhook fires the moment a comment lands; the bot sends a private reply with the offer and posts a short public acknowledgement under the comment.",
      },
      {
        title: "The owner edits the campaign, not the code",
        body: "Keywords, DM copy and public replies all live in a JSON rules file that is hot-reloaded — the shop owner changes a campaign without a developer or a redeploy.",
      },
      {
        title: "Bilingual whole-word matching",
        body: "Hebrew and English triggers tokenised on word boundaries, after an early version proved that naive substring matching fires on the wrong comments.",
      },
      {
        title: "Signed webhooks",
        body: "Every incoming request is verified against Meta's HMAC signature using a captured raw body, so nothing but Instagram can drive the bot.",
      },
      {
        title: "Never message anyone twice",
        body: "A de-duplication layer tracks handled comments, which matters more than it sounds when Meta redelivers webhooks.",
      },
      {
        title: "Self-healing authentication",
        body: "Long-lived tokens are refreshed automatically before their sixty-day expiry and persisted to disk, so a restart or a redeploy never drops the integration.",
      },
      {
        title: "Passed Meta App Review",
        body: "Including the public privacy policy page the platform requires, served by the bot itself, plus a 7,000-word setup guide written so a non-developer could complete the Meta app configuration.",
      },
      {
        title: "Free to run, always awake",
        body: "Deployed on a free tier with an external pinger defeating idle sleep — the whole system costs nothing to operate.",
      },
    ],
    architecture: [
      { title: "Follower", body: "Comments a trigger keyword on an Instagram post." },
      { title: "Signed webhook", body: "Meta Graph API delivers the event; the HMAC signature is verified." },
      { title: "Rules engine", body: "Bilingual whole-word match against the hot-reloaded rules file." },
      { title: "Reply", body: "Private DM with the offer, plus a short public reply under the comment." },
    ],
    stack: [
      { group: "Runtime", items: ["Node.js", "Express", "Two dependencies total"] },
      {
        group: "Platform",
        items: ["Instagram Graph API v23", "Private replies", "Comment replies", "HMAC verification"],
      },
      { group: "Ops", items: ["Render", "UptimeRobot keep-alive", "Token auto-rotation"] },
    ],
    // The repository is private (it holds a real client's campaign copy), so
    // there is nothing public to link to here.
    links: [],
    illustration: "dm-flow",
    coverAlt: "Diagram of the comment-to-DM flow: a keyword comment triggers a private message and a public reply",
    gallery: [],
    accent: "#f9a8d4",
  },

  {
    slug: "work-continuity-agent",
    name: "Work-Continuity Agent",
    tagline: "It holds the thread of your work.",
    hook: "A desktop AI agent that watches how your day actually goes, then tells you where you were when you get interrupted — entirely local, with zero dependencies.",
    category: "Desktop agent · Systems · Privacy",
    year: "2026",
    status: "Shipped",
    summary: [
      "Every interruption costs the twenty minutes it takes to remember what you were doing. This agent removes that cost: it snapshots your working context every sixty seconds — active window, everything else that's open, browser tabs, shell history, your own notes — notices when you've been pulled away, and hands you a short “here's where you were” briefing when you come back.",
      "It also tracks open loops. Commitments you made in a note, a sent email or a Slack message — “I'll send that Friday” — are extracted and followed until they close, and the day ends with a done / open / blocked digest.",
      "The constraint that makes it interesting: it is written in pure Python standard library with zero third-party packages. The tray icon, the global hotkey, the window enumeration, the browser-tab reading over COM automation and the Claude API client are all hand-built on ctypes and urllib.",
    ],
    metrics: [
      { value: "0", label: "third-party dependencies" },
      { value: "60s", label: "context capture interval" },
      { value: "14", label: "CLI commands" },
      { value: "100%", label: "local — no server, no telemetry" },
    ],
    features: [
      {
        title: "Interruption briefings",
        body: "When you return from being pulled away, a short briefing reconstructs what you were doing, what you had open, and what you had just been about to do.",
      },
      {
        title: "Open-loop tracking",
        body: "Commitments are extracted from notes, sent mail scanned over IMAP, and Slack messages, then tracked until they are actually closed.",
      },
      {
        title: "Global hotkey capture",
        body: "Ctrl+Alt+Space from inside any application snapshots the current state and prompts for a one-line note — and if the note reads like a promise, it becomes a tracked open loop.",
      },
      {
        title: "Privacy as an architectural choice",
        body: "Local-only, no server, no sync, no telemetry. API keys, email addresses and card numbers are redacted by pattern before anything is written to disk or sent to a model. Forgetting everything means deleting one folder.",
      },
      {
        title: "Zero dependencies, deliberately",
        body: "Window enumeration, idle detection, the system-tray icon, the message pump, COM-based UI automation for browser tabs and the Claude client are all built directly on ctypes and urllib.",
      },
      {
        title: "Crash-isolated tab reading",
        body: "Browser-tab titles are read through UI Automation in an isolated subprocess so a COM failure can never take down the agent, with an optional DevTools Protocol path for titles plus URLs.",
      },
      {
        title: "Works offline, upgrades silently",
        body: "Briefings and digests are generated heuristically with no API key present, and switch to Claude the moment one is configured — picked up live, without a restart.",
      },
      {
        title: "Daily digest and weekly patterns",
        body: "A done / open / blocked summary at the end of each day, and a weekly mirror showing where the time actually went.",
      },
    ],
    architecture: [
      { title: "Capture", body: "Win32 APIs snapshot windows, tabs and idle state every sixty seconds." },
      { title: "Redact", body: "Secrets and personal data are stripped by pattern before storage." },
      { title: "Store", body: "Everything is written to a local SQLite file that never leaves the machine." },
      { title: "Brief", body: "Claude — or an offline heuristic — turns the timeline into a readable briefing." },
    ],
    stack: [
      { group: "Language", items: ["Python 3.11", "Standard library only"] },
      { group: "System", items: ["ctypes Win32", "COM UI Automation", "Tray + global hotkey", "SQLite"] },
      { group: "AI", items: ["Claude API over urllib", "Heuristic offline fallback"] },
      { group: "Sources", items: ["IMAP sent mail", "Slack Web API", "Shell history", "Browser tabs"] },
    ],
    links: [],
    cover: "/screenshots/wca-report.webp",
    coverAlt: "Work-Continuity Agent — the local activity report with open loops and briefings",
    gallery: [
      {
        src: "/screenshots/wca-report.webp",
        alt: "The Work-Continuity Agent report showing snapshot counts, an open loop, and a generated daily digest",
        caption:
          "The local report from a real session: snapshot counts, a tracked open loop, and the digest it wrote at the end of the day. Generated on the machine, never uploaded.",
        wide: true,
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
