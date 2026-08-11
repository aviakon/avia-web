/**
 * A stylised illustration of the comment-to-DM mechanic. The Instagram bot has
 * no interface of its own to photograph, so this diagrams what it does rather
 * than pretending to be a screenshot of it.
 */
export function DmFlow({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden p-6"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, #f9a8d4 14%, #0a0a0f) 0%, #0a0a0f 70%)",
      }}
    >
      <div
        className={`w-full space-y-2.5 ${compact ? "max-w-[300px]" : "max-w-[380px]"}`}
      >
        <p className="text-ink-muted mb-3 text-center font-mono text-[10px] tracking-[0.18em] uppercase">
          Illustration
        </p>

        {/* The public comment that triggers everything. */}
        <div className="edge bg-surface/80 rounded-xl p-3.5 backdrop-blur-sm">
          <p className="text-ink-muted font-mono text-[9.5px] tracking-widest uppercase">
            Comment on the post
          </p>
          <p className="text-ink mt-1.5 text-sm">
            <span className="text-ink-dim">@dana_l</span> — I want it! <b>PRICE</b>
          </p>
        </div>

        <div className="flex items-center gap-2 pl-4">
          <span className="bg-hairline-strong h-6 w-px" />
          <span className="text-ink-muted font-mono text-[10px]">
            keyword matched · 1.2s
          </span>
        </div>

        {/* The private reply the bot sends back. */}
        <div
          className="rounded-xl p-3.5"
          style={{
            border: "1px solid color-mix(in oklab, #f9a8d4 32%, transparent)",
            background: "color-mix(in oklab, #f9a8d4 8%, #12121a)",
          }}
        >
          <p className="font-mono text-[9.5px] tracking-widest uppercase" style={{ color: "#f9a8d4" }}>
            Direct message · sent
          </p>
          <p className="text-ink mt-1.5 text-sm leading-relaxed">
            Here is your 15% code — <b>DANA15</b> — and the link to the piece 💎
          </p>
        </div>

        {!compact && (
          <div className="edge bg-surface/60 rounded-xl p-3.5">
            <p className="text-ink-muted font-mono text-[9.5px] tracking-widest uppercase">
              Public reply
            </p>
            <p className="text-ink-dim mt-1.5 text-sm" dir="rtl">
              אצלך בפרטי ❤️
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
