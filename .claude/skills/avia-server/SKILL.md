---
name: avia-server
description: Keep the Avia CV dev server up on port 3000. Checks whether the app is running and responding; if it is down, hung, or something else holds port 3000, frees the port, restarts the server, runs the smoke test, and shows the site in the user's Google Chrome. Use when asked to start, restart, check, or keep the site/server running, or on each tick of a /loop watching it.
---

# Keep Avia CV running on port 3000

Port 3000 is reserved for Avia CV. Never move the app to another port; if
something else holds 3000, free it.

The helper lives next to this file: `.claude/skills/avia-server/server.sh`.

## 1. Check health

```bash
.claude/skills/avia-server/server.sh status
```

- `HEALTHY` → the server is fine. Make sure the site is showing in Chrome,
  then report it in one line and stop. Do not restart and do not run the
  smoke test.
  ```bash
  .claude/skills/avia-server/server.sh open
  ```
  This reuses a tab that is already on the site, so loop ticks do not pile up
  tabs; it only opens a new one if there is none.
- `DOWN`, `UNRESPONSIVE`, or `WRONG_APP` → go to step 2.

## 2. Restart

1. If the preview tools are available, call `preview_list`. If a `portfolio`
   server is listed, `preview_stop` it (a hung server would otherwise be
   "reused" instead of restarted).
2. Free the port, whatever holds it:
   ```bash
   .claude/skills/avia-server/server.sh free
   ```
3. Start the server:
   - Preferred: `preview_start` with `{name: "portfolio"}` (from
     `.claude/launch.json`, pinned to `--port 3000`).
   - Only if the preview tools are not in this session:
     `.claude/skills/avia-server/server.sh start`.
4. Wait for it to come up:
   ```bash
   .claude/skills/avia-server/server.sh wait
   ```
   If it never becomes healthy, read the log it prints (or `preview_logs`),
   report the error, and stop. Do not loop on restarts.

## 3. Smoke test (after every restart)

```bash
node scripts/smoke.mjs http://localhost:3000 --local
```

This loads every route in Chromium and fails on non-200 responses or page
errors. `--local` skips the external link checks, which are slow and flaky.
Drop it only when the user asks for a full link check.

If it fails with `Executable doesn't exist` (Playwright's Chromium is not
downloaded), do not download it yourself. Run the HTTP-only fallback instead
and tell the user they can enable the full test with
`npx playwright install chromium`:

```bash
.claude/skills/avia-server/server.sh routes
```

If the preview pane is open, also take a screenshot of the home page and check
`read_console_messages` with `onlyErrors: true`. `WebSocket ... /_next/hmr
failed` errors are left over from the outage (the console buffer survives
reloads), not a problem with the new server.

## 4. Show it in Chrome

Always do this once the server is healthy again, without asking:

```bash
.claude/skills/avia-server/server.sh open --reload
```

This reloads the existing Avia CV tab in the user's Google Chrome (so it is no
longer showing the outage), or opens a new tab if there is none.

## 5. Report

Keep it short: what state you found, what you did (port freed from which pid,
restarted, opened or reloaded in Chrome), and the smoke result with any
failing routes verbatim.

## Watching continuously

A skill only runs when invoked. To keep the server watched, run it on a loop:

```
/loop 5m /avia-server
```
