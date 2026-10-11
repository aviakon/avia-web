---
name: avia-cv-app-testing-external
description: Test the live Avia CV site on Vercel (https://aviakonfino.vercel.app), the one shared with external users, end to end in the user's Chrome - domains, HTTPS, every link, share images, buttons, dialog and mobile menu - and report the issues in a short summary. Use when asked to test the live/production/Vercel/public site or check it before sharing the link. If a test request does not say local or live, ask the user whether to run this or avia-cv-app-testing-internal (localhost) first.
---

# Test Avia CV (live on Vercel)

`SITE` = `https://aviakonfino.vercel.app` (the official URL, from
`src/data/site.ts`). `https://avia-konfino.vercel.app`, linked from the
README, is a second deployment of the same site.

This is the public site: only read and click. Never submit anything and never
change deployment settings. Do not fix anything during the run; report
first, then offer fixes.

## 1. Site up

```bash
for u in https://aviakonfino.vercel.app https://avia-konfino.vercel.app; do curl -s -o /dev/null -L -m 20 -w "%{http_code} %{time_total}s $u\n" "$u"; done
curl -s -o /dev/null -m 20 -w "http -> %{http_code} %{redirect_url}\n" http://aviakonfino.vercel.app/
```

Both domains should return 200, and plain `http://` should redirect (308) to
`https://`. A domain that is down is the top issue in the report.

## 2. What is not live yet

```bash
git fetch -q origin && git log --oneline origin/master..HEAD && git status --short
```

Unpushed commits and uncommitted changes cannot be on the live site. List
them in the report so a bug that is already fixed locally is reported as
"fixed locally, not deployed", not as a new issue.

## 3. Link crawl (no browser)

```bash
node scripts/check-links.mjs https://aviakonfino.vercel.app --prod
```

Same crawl as the internal skill. `--prod` also requires every sitemap URL and
share image (`og:image`, what WhatsApp and LinkedIn show when the link is
pasted) to use the live domain. Each `FAIL` line is an issue.

## 4. Click through in Chrome

Read `.claude/skills/avia-cv-app-testing-internal/SKILL.md` and follow its
steps 3 (set up Chrome, bring the tab to the front) and 4 (click through,
desktop then mobile) with `SITE` set to `https://aviakonfino.vercel.app`.

Differences on the live site:
- Every console error counts; there is no dev-server noise to ignore.
- The first load can be slow while Vercel warms up; wait for the page before
  judging it.

## 5. Report

Keep it this short. Issues first, each with evidence and where to fix it;
then one line for everything that passed.

```
Avia CV test (live, aviakonfino.vercel.app) - <date>: <N> issues

✗ <what broke> - <evidence> - <file:line or likely cause>
✗ <bug> - fixed locally, not deployed yet
✗ ...

Not live yet: <n> unpushed commits, <n> uncommitted files (or "nothing, live = master")

✓ Both domains up, HTTPS redirect
✓ Links: <n> internal, <n> external, sitemap, share images, 404
✓ Navbar, See the work, logo
✓ Contact dialog (×, Esc, outside click, copy ×2)
✓ <n> project cards, <n> capability links, project page links
✓ Mobile menu, no sideways scroll
✓ No console errors
```

Then offer to fix the issues, and to commit and push so the fixes go live.
