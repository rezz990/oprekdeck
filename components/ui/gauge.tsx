import { cn } from "./cn";

export type GaugeTone = "accent" | "safe" | "caution" | "danger";

const toneClasses: Record<GaugeTone, string> = {
  accent: "text-accent",
  safe: "text-safe",
  caution: "text-caution",
  danger: "text-danger",
};

const GAUGE_RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

const TICKS = Array.from({ length: 40 }, (_, index) => {
  const angle = (index / 40) * Math.PI * 2 - Math.PI / 2;
  const innerRadius = index % 5 === 0 ? 52 : 54;
  return {
    x1: 60 + Math.cos(angle) * innerRadius,
    y1: 60 + Math.sin(angle) * innerRadius,
    x2: 60 + Math.cos(angle) * 57,
    y2: 60 + Math.sin(angle) * 57,
  };
});

export type GaugeProps = {
  value: number;
  max?: number;
  label: string;
  unit?: string;
  tone?: GaugeTone;
  size?: number;
  caption?: string;
  className?: string;
};

export function Gauge({
  value,
  max = 100,
  label,
  unit,
  tone = "accent",
  size = 152,
  caption,
  className,
}: GaugeProps) {
  const safeMax = max > 0 ? max : 1;
  const clampedValue = Math.min(Math.max(value, 0), safeMax);
  const progress = clampedValue / safeMax;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 1,
  }).format(clampedValue);
  const toneClass = toneClasses[tone];

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clampedValue}
        aria-label={`${label}: ${formatted}${unit ? ` ${unit}` : ""}`}
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg aria-hidden="true" viewBox="0 0 120 120" className="h-full w-full">
          <g
            className="hud-gauge__ticks text-line-strong/70"
            stroke="currentColor"
            strokeWidth="1"
          >
            {TICKS.map((tick, index) => (
              <line
                key={index}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
              />
            ))}
          </g>
          <circle
            cx="60"
            cy="60"
            r={GAUGE_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-line-strong/60"
          />
          <circle
            cx="60"
            cy="60"
            r={GAUGE_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 60 60)"
            className={cn("hud-gauge__ring", toneClass)}
          />
        </svg>
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span
            className={cn(
              "font-mono text-2xl font-medium tracking-tight",
              toneClass,
            )}
          >
            {formatted}
            {unit ? (
              <span className="ml-0.5 align-baseline text-[10px] uppercase tracking-[0.1em]">
                {unit}
              </span>
            ) : null}
          </span>
        </div>
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        {label}
      </p>
      {caption ? (
        <p className="mt-1 max-w-56 text-center text-[11px] leading-4 text-ink-dim">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
