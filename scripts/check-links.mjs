/**
 * Crawls every page of Avia CV reachable from / and checks every link on it:
 * internal pages return 200 and their #anchors exist, external links are
 * reachable and open in a new tab, mailto:/tel: are well formed. Also checks
 * every sitemap URL, every page's share image (og:image), and that an unknown
 * route returns 404.
 *
 *   node scripts/check-links.mjs [baseUrl] [--prod]
 *
 * --prod also requires the sitemap and share images to point at baseUrl's own
 * domain (locally the sitemap points at the live site, so it is off there).
 */
const args = process.argv.slice(2);
const prod = args.includes("--prod");
const base = (args.find((arg) => !arg.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const origin = new URL(base).origin;
const pages = new Map(); // path -> { status, html }
const links = new Map(); // href -> { attrs, from: Set<path> }
let failures = 0;

const report = (ok, label, detail = "") => {
  if (!ok) failures += 1;
  console.log(`${ok ? "ok  " : "FAIL"} ${label}${detail ? `  ${detail}` : ""}`);
};

async function load(path) {
  if (!pages.has(path)) {
    const res = await fetch(base + path);
    pages.set(path, { status: res.status, html: await res.text() });
  }
  return pages.get(path);
}

const attr = (tag, name) =>
  tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]?.replaceAll("&amp;", "&");

// Crawl.
const queue = ["/"];
const queued = new Set(queue);
while (queue.length) {
  const path = queue.shift();
  const page = await load(path);
  for (const [tag] of page.html.matchAll(/<a\b[^>]*>/g)) {
    let href = attr(tag, "href");
    if (!href) continue;
    if (href.startsWith("#")) href = path + href;
    if (!links.has(href)) links.set(href, { tag, from: new Set() });
    links.get(href).from.add(path);
    if (href.startsWith("/")) {
      const target = href.split("#")[0] || "/";
      if (!queued.has(target)) queued.add(target) && queue.push(target);
    }
  }
}

console.log(`pages (${pages.size}):`);
for (const [path, { status }] of pages) report(status === 200, `${status} ${path}`);

console.log(`\nlinks (${links.size}):`);
for (const [href, { tag, from }] of links) {
  const where = `(on ${[...from].join(", ")})`;
  if (href.startsWith("/")) {
    const [path, hash] = href.split("#");
    const page = await load(path || "/");
    const anchorOk = !hash || page.html.includes(`id="${hash}"`);
    report(page.status === 200 && anchorOk, href, page.status !== 200 ? `${page.status} ${where}` : anchorOk ? "" : `#${hash} missing ${where}`);
  } else if (href.startsWith("mailto:")) {
    report(/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(href), href);
  } else if (href.startsWith("tel:")) {
    report(/^tel:\+\d{8,15}$/.test(href), href);
  } else if (/^https?:/.test(href)) {
    const newTab = attr(tag, "target") === "_blank" && /noopener|noreferrer/.test(attr(tag, "rel") ?? "");
    let status = 0;
    try {
      status = (await fetch(href, { redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "user-agent": "Mozilla/5.0" } })).status;
    } catch {}
    // LinkedIn and some others answer bots with 999/403; that is not a dead link.
    const blocked = status === 999 || status === 403;
    report(status > 0 && (status < 400 || blocked) && newTab, href, `${status || "unreachable"}${blocked ? " (bot-blocked, check by hand)" : ""}${newTab ? "" : " not opening in a new tab"} ${status >= 400 && !blocked ? where : ""}`.trim());
  } else {
    report(false, href, `unexpected link ${where}`);
  }
}

console.log("\nshare images:");
for (const [path, { html }] of [...pages]) {
  for (const [tag] of html.matchAll(/<meta\b[^>]*(?:og:image|twitter:image)"[^>]*>/g)) {
    const url = new URL(attr(tag, "content"));
    const res = await fetch(base + url.pathname + url.search, { signal: AbortSignal.timeout(60000) }).catch((error) => ({ status: `error (${error.cause?.code ?? error.name})`, ok: false, headers: new Headers() }));
    const type = res.headers.get("content-type") ?? "";
    const sameDomain = url.origin === origin;
    report(res.ok && type.startsWith("image/") && sameDomain, `${attr(tag, "property") ?? attr(tag, "name")} on ${path}`, `${res.status} ${type}${sameDomain ? "" : ` points at ${url.origin}`}`);
  }
}

console.log("\nextras:");
for (const path of ["/sitemap.xml", "/robots.txt"]) report((await load(path)).status === 200, `${pages.get(path).status} ${path}`);
for (const [, loc] of pages.get("/sitemap.xml").html.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const url = new URL(loc);
  const path = url.pathname;
  const domainOk = !prod || url.origin === origin;
  report((await load(path)).status === 200 && domainOk, `sitemap ${path}`, `${pages.get(path).status}${domainOk ? "" : ` points at ${url.origin}`}`);
}
report((await fetch(`${base}/__no_such_page__`)).status === 404, "unknown route returns 404");

console.log(failures === 0 ? "\nall link checks passed" : `\n${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
