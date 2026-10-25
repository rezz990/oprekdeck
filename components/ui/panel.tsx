import type { ReactNode } from "react";
import { cn } from "./cn";

export type HudPanelProps = {
  eyebrow?: string;
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function HudPanel({
  eyebrow,
  title,
  action,
  children,
  className,
  contentClassName,
}: HudPanelProps) {
  const hasHeader = Boolean(eyebrow || title || action);

  return (
    <section
      className={cn(
        "hud-panel relative overflow-hidden rounded-hud border border-line/80 bg-panel/90",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="hud-panel__grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="hud-panel__ornaments pointer-events-none absolute inset-0"
      >
        <span className="hud-panel__corner hud-panel__corner--tl" />
        <span className="hud-panel__corner hud-panel__corner--tr" />
        <span className="hud-panel__corner hud-panel__corner--bl" />
        <span className="hud-panel__corner hud-panel__corner--br" />
      </div>

      {hasHeader ? (
        <header className="relative flex items-start justify-between gap-4 border-b border-line/70 px-5 py-4">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent/80">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="mt-1 font-display text-base font-semibold tracking-wide text-ink">
                {title}
              </h2>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}

      <div className={cn("relative p-5", contentClassName)}>{children}</div>
    </section>
  );
}
