import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-accent/60 bg-accent text-void hover:bg-accent-bright hud-button--glow",
  secondary:
    "border-line-strong bg-panel-raised/60 text-ink hover:border-accent/60 hover:text-accent",
  ghost:
    "border-transparent bg-transparent text-ink-muted hover:bg-white/5 hover:text-ink",
  danger:
    "border-critical/50 bg-critical/10 text-critical hover:bg-critical/20 hud-button--danger-glow",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[10px]",
  md: "h-10 px-4 text-[11px]",
  lg: "h-12 px-6 text-xs",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border font-mono font-medium uppercase tracking-[0.14em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
