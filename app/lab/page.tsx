import type { Metadata } from "next";
import Link from "next/link";
import { Showcase } from "./showcase";

export const metadata: Metadata = {
  title: "Lab Komponen — OprekDeck",
  robots: {
    index: false,
    follow: false,
  },
};

const colorTokens = [
  { name: "void", value: "#04070C", className: "bg-void" },
  { name: "deck", value: "#060A11", className: "bg-deck" },
  { name: "panel", value: "#0A111C", className: "bg-panel" },
  { name: "line", value: "#1C2A3D", className: "bg-line" },
  { name: "accent", value: "#22D3EE", className: "bg-accent" },
  { name: "safe", value: "#34D399", className: "bg-safe" },
  { name: "info", value: "#60A5FA", className: "bg-info" },
  { name: "caution", value: "#FBBF24", className: "bg-caution" },
  { name: "danger", value: "#FB7185", className: "bg-danger" },
  { name: "critical", value: "#F43F5E", className: "bg-critical" },
];

export default function LabPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80"
        style={{
          backgroundImage:
            "radial-gradient(60% 100% at 50% 0%, rgba(34, 211, 238, 0.12), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <header>
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim transition-colors hover:text-accent"
          >
            ← Beranda
          </Link>
          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            T-002 · Component lab
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Sistem visual cockpit
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-muted">
            Pratinjau token dan komponen dasar OprekDeck. Konten yang sama
            dirender pada dua tier kualitas: high menampilkan grid, sudut HUD,
            dan glow; low tampil datar tanpa efek.
          </p>
        </header>

        <section
          aria-labelledby="tokens-title"
          className="mt-10 rounded-hud border border-line/70 bg-panel/40 p-5"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent/80">
                Design tokens
              </p>
              <h2
                id="tokens-title"
                className="mt-1 font-display text-base font-semibold tracking-wide"
              >
                Palet dan tipografi
              </h2>
            </div>
            <code className="rounded border border-line/70 bg-deck/60 px-2 py-1 font-mono text-[10px] text-ink-dim">
              app/globals.css
            </code>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {colorTokens.map((token) => (
              <div
                key={token.name}
                className="rounded-md border border-line/60 bg-deck/60 p-2"
              >
                <div
                  className={`h-8 rounded border border-white/10 ${token.className}`}
                />
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
                  {token.name}
                </p>
                <p className="font-mono text-[9px] text-ink-dim">
                  {token.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 border-t border-line/60 pt-5 lg:grid-cols-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-dim">
                Display · Chakra Petch
              </p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
                OprekDeck // Cockpit
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-dim">
                Mono · JetBrains Mono
              </p>
              <p className="mt-2 font-mono text-sm text-ink-muted">
                getprop ro.product.model
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-dim">
                Body · system sans
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Debloat aman dengan snapshot dan jalan kembali.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-12 space-y-12">
          <Showcase quality="high" />
          <Showcase quality="low" />
        </div>
      </div>
    </main>
  );
}
