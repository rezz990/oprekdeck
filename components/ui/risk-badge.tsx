import type { SVGProps } from "react";
import { cn } from "./cn";

export type RiskLevel =
  | "aman"
  | "disarankan"
  | "sedang"
  | "lanjutan"
  | "ahli"
  | "jangan";

type RiskIconName = "check" | "spark" | "triangle" | "diamond" | "octagon";

type RiskMeta = {
  label: string;
  toneClass: string;
  icon: RiskIconName;
};

const riskMeta: Record<RiskLevel, RiskMeta> = {
  aman: {
    label: "Aman",
    toneClass: "border-safe/40 bg-safe/10 text-safe",
    icon: "check",
  },
  disarankan: {
    label: "Disarankan",
    toneClass: "border-info/40 bg-info/10 text-info",
    icon: "spark",
  },
  sedang: {
    label: "Sedang",
    toneClass: "border-caution/40 bg-caution/10 text-caution",
    icon: "triangle",
  },
  lanjutan: {
    label: "Lanjutan",
    toneClass: "border-danger/40 bg-danger/10 text-danger",
    icon: "triangle",
  },
  ahli: {
    label: "Ahli",
    toneClass: "border-danger/50 bg-danger/10 text-danger",
    icon: "diamond",
  },
  jangan: {
    label: "Jangan",
    toneClass: "border-critical/50 bg-critical/10 text-critical",
    icon: "octagon",
  },
};

function RiskIcon({ name }: { name: RiskIconName }) {
  const props: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: "size-3 shrink-0",
  };

  switch (name) {
    case "check":
      return (
        <svg {...props}>
          <circle cx="6" cy="6" r="4.4" />
          <path d="m3.8 6.1 1.5 1.5 2.9-3.1" />
        </svg>
      );
    case "spark":
      return (
        <svg {...props}>
          <path d="M6 1.6 7.2 4.8 10.4 6 7.2 7.2 6 10.4 4.8 7.2 1.6 6 4.8 4.8Z" />
        </svg>
      );
    case "triangle":
      return (
        <svg {...props}>
          <path d="M6 1.8 10.8 10.2H1.2L6 1.8Z" />
          <path d="M6 4.6v2.6" />
          <path d="M6 9.1h.01" />
        </svg>
      );
    case "diamond":
      return (
        <svg {...props}>
          <path d="M6 1.4 10.6 6 6 10.6 1.4 6Z" />
          <path d="M6 4.2v2.5" />
          <path d="M6 8.8h.01" />
        </svg>
      );
    case "octagon":
      return (
        <svg {...props}>
          <path d="M4.1 1.5h3.8L11 4.1v3.8L8 11H4L1 8.3V4.1L4.1 1.5Z" />
          <path d="m4.4 4.4 3.2 3.2M7.6 4.4 4.4 7.6" />
        </svg>
      );
  }
}

export type RiskBadgeProps = {
  risk: RiskLevel;
  className?: string;
};

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  const meta = riskMeta[risk];

  return (
    <span
      className={cn(
        "risk-badge inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em]",
        meta.toneClass,
        className,
      )}
    >
      <RiskIcon name={meta.icon} />
      {meta.label}
    </span>
  );
}
