type GradientGlowProps = {
  className?: string;
  color?: string;
  /** 0–1 */
  opacity?: number;
  drift?: boolean;
};

/** A soft radial bloom used to light sections without an image request. */
export function GradientGlow({
  className = "",
  color = "#66e3ff",
  opacity = 0.16,
  drift = false,
}: GradientGlowProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-[110px] ${drift ? "animate-drift" : ""} ${className}`}
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
      }}
    />
  );
}
