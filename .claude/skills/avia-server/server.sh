#!/usr/bin/env bash
# Health check and port control for the Avia CV dev server on port 3000.
#
#   server.sh status   prints HEALTHY | DOWN | UNRESPONSIVE | WRONG_APP; exit 0 only when HEALTHY
#   server.sh free     stops whatever holds port 3000
#   server.sh wait     waits up to 90s for the app to become HEALTHY
#   server.sh start    fallback launcher when the preview tools are unavailable
#   server.sh routes   HTTP-only smoke of the routes in scripts/smoke.mjs (no browser needed)
#   server.sh open [--reload]
#                      shows the site in Google Chrome: reuses a tab already on it
#                      (reloading it with --reload), otherwise opens a new one
set -u

PORT=3000
URL="http://localhost:$PORT/"
MARKER="Avia Konfino"
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
LOG="$ROOT/.next/dev-server.log"

pids() { lsof -nP -ti "tcp:$PORT" -sTCP:LISTEN 2>/dev/null; }

status() {
  local pid body code
  pid="$(pids | xargs)"
  if [ -z "$pid" ]; then
    echo "DOWN  nothing is listening on port $PORT"
    return 1
  fi
  body="$(curl -s -m 15 -w '\n%{http_code}' "$URL")"
  code="$(printf '%s' "$body" | tail -n 1)"
  if [ "$code" != "200" ]; then
    echo "UNRESPONSIVE  pid $pid holds port $PORT but GET / returned '${code:-timeout}'"
    return 2
  fi
  if ! printf '%s' "$body" | grep -q "$MARKER"; then
    echo "WRONG_APP  pid $pid on port $PORT answers but is not Avia CV"
    return 3
  fi
  echo "HEALTHY  Avia CV on $URL (pid $pid)"
}

free() {
  local pid
  pid="$(pids)"
  [ -z "$pid" ] && { echo "port $PORT already free"; return 0; }
  echo "stopping pid(s) $(echo $pid) on port $PORT"
  kill $pid 2>/dev/null
  for _ in $(seq 1 10); do
    [ -z "$(pids)" ] && { echo "port $PORT free"; return 0; }
    sleep 0.5
  done
  kill -9 $(pids) 2>/dev/null
  sleep 0.5
  [ -z "$(pids)" ] && echo "port $PORT free (forced)" || { echo "could not free port $PORT"; return 1; }
}

wait_healthy() {
  for _ in $(seq 1 45); do
    status >/dev/null && { status; return 0; }
    sleep 2
  done
  status
  echo "gave up after 90s; recent log:"
  tail -n 30 "$LOG" 2>/dev/null
  return 1
}

start() {
  mkdir -p "$ROOT/.next"
  cd "$ROOT" && nohup npm run dev -- --port "$PORT" >"$LOG" 2>&1 &
  echo "started next dev (log: $LOG)"
}

routes() {
  local failures=0 route code
  for route in $(sed -n '/const routes = \[/,/\];/p' "$ROOT/scripts/smoke.mjs" | grep -o '"/[^"]*"' | tr -d '"'); do
    code="$(curl -s -o /dev/null -m 60 -w '%{http_code}' "http://localhost:$PORT$route")"
    if [ "$code" = "200" ]; then echo "ok   $code $route"; else echo "FAIL $code $route"; failures=$((failures + 1)); fi
  done
  [ "$failures" -eq 0 ] && echo "all routes returned 200" || { echo "$failures route(s) failed"; return 1; }
}

open_chrome() {
  local found
  found="$(osascript - "$URL" "${1:-}" <<'APPLESCRIPT' 2>&1
on run argv
  set target to item 1 of argv
  tell application "Google Chrome"
    repeat with w in windows
      repeat with t in tabs of w
        if URL of t starts with target then
          if item 2 of argv is "--reload" then reload t
          return "found"
        end if
      end repeat
    end repeat
  end tell
  return "none"
end run
APPLESCRIPT
)"
  if [ "$found" = "found" ]; then
    [ "${1:-}" = "--reload" ] && echo "reloaded the Avia CV tab in Chrome" || echo "Avia CV already open in Chrome"
    return 0
  fi
  [ "$found" != "none" ] && echo "could not read Chrome tabs ($found); opening a new tab"
  open -a "Google Chrome" "$URL" && echo "opened $URL in Chrome"
}

case "${1:-status}" in
  status) status ;;
  free) free ;;
  wait) wait_healthy ;;
  start) start ;;
  routes) routes ;;
  open) open_chrome "${2:-}" ;;
  *) echo "usage: $0 status|free|wait|start|routes|open [--reload]" >&2; exit 64 ;;
esac
