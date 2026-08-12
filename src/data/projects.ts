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
  /** A line under the lead cover image, for projects with only one screenshot. */
  coverCaption?: string;
  /** The cover's own aspect ratio, so its frame matches the file exactly. */
  coverRatio?: string;
  /**
   * Show the gallery itself as the lead visual, for a product whose story is a
   * sequence of screens rather than one page. The gallery is not repeated
   * further down when this is set.
   */
  leadMedia?: "gallery";
  /** Columns the gallery lays out in on a wide screen. Three suits phone shots. */
  galleryColumns?: 2 | 3;
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
        body: "278 frames painted to a canvas and scrubbed by scroll, preloaded so the first frame is instant.",
      },
      {
        title: "A voice sales agent on web and phone",
        body: "One ElevenLabs agent, embedded in the page and wired to a Twilio number. Same agent either way.",
      },
      {
        title: "Agent tools that write to production",
        body: "Five secured webhooks: live stock, real orders, meeting booking with a calendar invite, leads, callbacks.",
      },
      {
        title: "Eleven operational automations",
        body: "Confirmations, shipping mail, follow ups, referral rewards, stock deduction, low stock alerts, a weekly digest.",
      },
      {
        title: "Agent provisioning in one command",
        body: "An idempotent script rebuilds the secret, knowledge base, every tool and the agent itself from scratch.",
      },
      {
        title: "A commercial generated with AI",
        body: "A full product film, embedded to play the moment it enters view, with a reduced motion fallback.",
      },
      {
        title: "Airtable as the operations console",
        body: "Orders, leads and stock live in Airtable, whose automations fire webhooks back into the app.",
      },
      {
        title: "Tested and instrumented",
        body: "Playwright specs including a live order run, plus edge generated social images, sitemap and robots.",
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
      { value: "∞", label: "tables live at once, all in sync" },
      { value: "QR", label: "join, no account needed" },
    ],
    features: [
      {
        title: "A camera that counts chips",
        body: "A Gemini vision model reads the stack edge lines and checks itself against the room's denominations.",
      },
      {
        title: "Settlement in the fewest transfers",
        body: "Greedy debt simplification reduces the table to the smallest set of payments. A pure, testable function.",
      },
      {
        title: "A live table from your own seat",
        body: "The felt rotates so you are always at the bottom, and updates through Firestore as buy ins land.",
      },
      {
        title: "Join by QR, even mid game",
        body: "A six character code and a QR invite. Latecomers join in progress and rebuy without asking the host.",
      },
      {
        title: "End game entry that always reconciles",
        body: "The last player's total is calculated from the pot, so the numbers can never fail to add up.",
      },
      {
        title: "A settlement card worth sharing",
        body: "The result renders as a shareable card with the game image and stats, and a confetti finish.",
      },
      {
        title: "A native iOS twin",
        body: "A parallel SwiftUI app: twenty five files across seven screens, on iOS 17 observation and NavigationStack.",
      },
      {
        title: "Chips drawn, not photographed",
        body: "Chips, stacks and the denomination picker drawn as components, plus twelve preset avatars.",
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
    // The cover image is a cropped band used only for the compact card on the
    // home page. The case study itself leads with the gallery below, since the
    // product is genuinely a sequence of three screens rather than one page.
    cover: "/screenshots/poker-cover.webp",
    coverAlt: "The Poker Splitter felt, with the total pot and two players seated",
    leadMedia: "gallery",
    galleryColumns: 3,
    gallery: [
      {
        src: "/screenshots/poker-lobby.webp",
        alt: "A Poker Splitter lobby showing the room code, a QR invite, and four players who have joined",
        caption:
          "The lobby: a six character code, a QR invite, and players appearing live as they join.",
        ratio: "900 / 1951",
      },
      {
        src: "/screenshots/poker-table.webp",
        alt: "The live Poker Splitter table with four players seated around the felt and a total pot of 450 dollars",
        caption:
          "The live table, rendered from your own seat. Buy ins and rebuys land here in realtime.",
        ratio: "900 / 1951",
      },
      {
        src: "/screenshots/poker-settlement.webp",
        alt: "The Poker Splitter settlement screen listing three payments needed to settle the table",
        caption:
          "The settlement. Four players and a 450 dollar pot reduced to three payments, and no argument.",
        ratio: "900 / 1951",
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
        body: "PDF and Word parsed directly. A photo of a resume is read by Windows OCR and Claude vision.",
      },
      {
        title: "A score from 0 to 100, explained",
        body: "Claude scores every posting with a written rationale: why you fit, and what you are missing.",
      },
      {
        title: "Six sources, thousands of postings",
        body: "Five ATS APIs read company boards direct, and an aggregator reaches LinkedIn and Indeed without scraping.",
      },
      {
        title: "Works with no API key at all",
        body: "Runs offline on a bilingual heuristic scorer, and upgrades itself to Claude the moment a key appears.",
      },
      {
        title: "A matching engine in two languages",
        body: "Role titles, seniority and prefiltering across Hebrew and English, in an interface that lays out right to left.",
      },
      {
        title: "Skill gauges you can turn",
        body: "Set your years on a skill and the next search reweights its ranking accordingly.",
      },
      {
        title: "Cover letters and tailoring advice",
        body: "A cover letter in each posting's own language, plus what to change on the resume for that role.",
      },
      {
        title: "Monetisation, built in honestly",
        body: "Self serve sponsored slots with click statistics, designed so a paid slot can never pass as a ranked match.",
      },
      {
        title: "Analytics that collect nothing",
        body: "No tracker, no cookies, no stored IPs. Visitors hashed with a salt that rotates at midnight.",
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
        src: "/screenshots/jobscout-start.webp",
        alt: "JobScout resume upload step offering file, text, photo and link options",
        caption:
          "Step one: a resume as a file, pasted text, a link, or a photograph read by OCR and Claude vision.",
        wide: true,
      },
      {
        src: "/screenshots/jobscout-scoreboard.webp",
        alt: "JobScout scoreboard showing 25 companies, an average score of 46, a maximum score of 70 and 76 matches",
        caption:
          "The scoreboard from a real scan: twenty five companies, seventy six matches, a top score of seventy.",
        wide: true,
        ratio: "1600 / 203",
      },
      {
        src: "/screenshots/jobscout-matches.webp",
        alt: "Ranked JobScout matches with colour coded scores and the reasons behind each one",
        caption:
          "Every match ranked and scored, with the reasoning shown rather than hidden behind the number.",
        wide: true,
        ratio: "1600 / 1312",
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
        body: "A webhook fires the moment a comment lands. A private message goes out, and a short public reply follows.",
      },
      {
        title: "The owner edits the campaign, not the code",
        body: "Keywords and copy live in a JSON file that reloads live. No developer, no redeploy.",
      },
      {
        title: "Matching on word boundaries, in two languages",
        body: "Hebrew and English triggers tokenised properly, after substring matching proved to fire on the wrong comments.",
      },
      {
        title: "Signed webhooks",
        body: "Every request is verified against Meta's signature, so nothing but Instagram can drive the bot.",
      },
      {
        title: "Nobody is ever messaged twice",
        body: "A deduplication layer tracks handled comments, which matters when Meta redelivers webhooks.",
      },
      {
        title: "Authentication that heals itself",
        body: "Tokens refresh before their sixty day expiry and persist to disk, so a restart never drops the integration.",
      },
      {
        title: "Passed Meta App Review",
        body: "Including the privacy policy page the platform requires, and a setup guide a non developer could follow.",
      },
      {
        title: "Free to run, always awake",
        body: "A free tier plus an external pinger defeating idle sleep. The whole system costs nothing to operate.",
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
        body: "Come back and a short briefing reconstructs what you were doing and what you were about to do.",
      },
      {
        title: "Open loops, tracked until they close",
        body: "Commitments pulled from notes, sent mail and Slack, then followed until they actually close.",
      },
      {
        title: "Capture from anywhere with a hotkey",
        body: "Ctrl+Alt+Space snapshots the state and takes a note. If it reads like a promise, it becomes an open loop.",
      },
      {
        title: "Privacy as an architectural choice",
        body: "Local only, no server or telemetry. Keys and personal data redacted before anything touches disk.",
      },
      {
        title: "Built on the Windows system layer",
        body: "Windows, idle state, tray icon and tab reading built straight against the platform. One small process.",
      },
      {
        title: "Tab reading that cannot take it down",
        body: "Tab titles are read in an isolated subprocess, so a COM failure can never crash the agent.",
      },
      {
        title: "Works offline, upgrades silently",
        body: "Heuristics with no key present, switching to Claude the moment one is configured. No restart.",
      },
      {
        title: "A daily digest and a weekly mirror",
        body: "Done, open and blocked at the end of each day, and a weekly view of where the time went.",
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
    coverRatio: "1600 / 1045",
    coverCaption:
      "The local report from a real session: snapshot counts, a tracked open loop, and the digest it wrote at the end of the day. Generated on the machine, never uploaded.",
    // The cover image above is the only screenshot this project has, and it is
    // already shown at the top of the page — nothing left to repeat here.
    gallery: [],
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
