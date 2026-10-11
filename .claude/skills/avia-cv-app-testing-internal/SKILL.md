---
name: avia-cv-app-testing-internal
description: Test the local Avia CV dev server (localhost:3000) end to end in the user's Chrome - every link, button, dialog and the mobile menu - and report the issues in a short summary. Use when asked to test the site locally or before pushing. If a test request does not say local or live, ask the user whether to run this or avia-cv-app-testing-external (the live Vercel site) first.
---

# Test Avia CV (local)

`SITE` = `http://localhost:3000`

Two parts: a script checks every link without a browser, then Claude in Chrome
clicks every button like a user would. Finish with the short report in step 5.
Do not fix anything during the run; report first, then offer fixes.

## 1. Server up

Run the `avia-server` skill (or `.claude/skills/avia-server/server.sh status`).
Do not test until it reports `HEALTHY`.

## 2. Link crawl (no browser)

```bash
node scripts/check-links.mjs SITE
```

Crawls every page from `/` and checks every internal link and `#anchor`,
external link (reachable, opens in a new tab), `mailto:`/`tel:` format,
share images (`og:image`), every sitemap URL, and that an unknown route
returns 404. Each `FAIL` line is an issue for the report.

Known local-only issue: share images return 500 ("Input buffer contains
unsupported image format") on the dev server while the live site serves them
fine. Report it once as a dev-server issue, not as 12 failures.

## 3. Set up Chrome

1. Load the `chrome-browser` skill, then its tools in one ToolSearch:
   `tabs_context_mcp, tabs_create_mcp, tabs_close_mcp, navigate, computer,
   find, javascript_tool, read_console_messages, resize_window, browser_batch`.
   If the extension is not connected, tell the user to open the Claude side
   panel in Chrome and sign in; do not fall back to another browser without
   asking.
2. `tabs_context_mcp` with `createIfEmpty: true`, navigate the tab to `SITE`.
3. **Bring the tab to the front.** A background tab is `document.hidden`, and
   Chrome pauses animation frames there, so smooth scrolling and Next.js hash
   links stall and every scroll result is wrong. Set
   `document.title = '__avia_test__'` with `javascript_tool`, then:
   ```bash
   osascript -e 'tell application "Google Chrome"
     repeat with w in windows
       set i to 0
       repeat with t in tabs of w
         set i to i + 1
         if title of t is "__avia_test__" then
           set active tab index of w to i
           set index of w to 1
         end if
       end repeat
     end repeat
     activate
   end tell'
   ```
   Confirm `document.hidden === false` before going on. Reload the page so the
   title resets.

## 4. Click through (desktop, then mobile)

Use `browser_batch` for each group. Prefer `find` refs or coordinates read
from a fresh screenshot; the window height changes when the side panel opens.
After every click, wait 1-2 s before measuring.

**Inventory.** List every link and button on `/` so nothing is missed:
```js
[...document.querySelectorAll('a, button')].map(el => ({ text: (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40), href: el.getAttribute('href'), section: el.closest('section, header, footer, nav')?.id || el.closest('section, header, footer, nav')?.tagName }))
```
Anything in that list not covered below gets clicked too.

**Navbar.** Click Work, Capabilities, About, Contact, then the logo. Each
section should land at about 80 px from the top (under the navbar); the logo
returns to `scrollY` 0:
```js
Math.round(document.getElementById('work').getBoundingClientRect().top)
```
Also click "See the work".

**Contact dialog** ("Get in touch"). Check it opens
(`!!document.querySelector('[role=dialog]')`) and closes three ways: the ×,
Escape, and a click on the dimmed area outside the panel. A click inside the
panel must not close it. Before the copy buttons, stub the clipboard so the
user's real clipboard is untouched:
```js
window.__copied = []; navigator.clipboard.writeText = async (t) => { window.__copied.push(t); };
```
Click both COPY buttons; each should switch to COPIED and `window.__copied`
should hold the phone and the email.

**Project cards and capability links.** Cards animate in on scroll, so
scroll each into view and wait ~1.3 s before clicking. Check nothing covers
a link at its click point:
```js
const a = document.querySelector('#work a[href="/projects/jobscout"]');
a.scrollIntoView({ block: 'center', behavior: 'instant' });
await new Promise(r => setTimeout(r, 1300));
const r = a.getBoundingClientRect(), hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
a.contains(hit)
```
Then really click every card and confirm `location.pathname` and the page
`h1` match.

**Project page** (any one; they share a layout). Click "← All work" (back to
`/#work`, section at ~80 px), "Next project" (next page, at the top), a
navbar link (returns to the home page section), and "Get in touch".

**Mobile.** Record `outerWidth`/`outerHeight` first, then `resize_window` to
400 wide (Chrome stops at ~535 px of viewport, which is enough). Check
`document.documentElement.scrollWidth <= innerWidth` (no sideways scroll),
open the ☰ menu, click a link (scrolls there and closes the menu), and close
it with × and with Escape. **Restore the window size afterwards.**

**Console.** `read_console_messages` with `onlyErrors: true`. `/_next/hmr`
WebSocket errors from a server restart are not issues.

Do not click `mailto:`/`tel:` links (they open Mail/FaceTime); step 2 checks
them. Close the tab you created when done.

## 5. Report

Keep it this short. Issues first, each with evidence and where to fix it;
then one line for everything that passed. No step-by-step narrative.

```
Avia CV test (local) - <date>: <N> issues

✗ <what broke> - <evidence> - <file:line or likely cause>
✗ ...

✓ Links: <n> internal, <n> external, sitemap, 404
✓ Navbar, See the work, logo
✓ Contact dialog (×, Esc, outside click, copy ×2)
✓ <n> project cards, <n> capability links, project page links
✓ Mobile menu, no sideways scroll
✓ No console errors
```

Then offer to fix the issues.
