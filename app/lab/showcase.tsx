import { Button } from "@/components/ui/button";
import { Gauge } from "@/components/ui/gauge";
import { HudPanel } from "@/components/ui/panel";
import { RiskBadge } from "@/components/ui/risk-badge";

export type QualityTier = "high" | "low";

const tweakRisks = ["aman", "sedang", "lanjutan"] as const;
const debloatRisks = ["aman", "disarankan", "lanjutan", "ahli", "jangan"] as const;

export function Showcase({ quality }: { quality: QualityTier }) {
  return (
    <section
      data-quality={quality}
      aria-label={`Contoh komponen tier ${quality}`}
      className="space-y-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line/60 pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/80">
            Quality tier
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-wide text-ink">
            {quality === "high" ? "High" : "Low"}
          </p>
        </div>
        <code className="rounded border border-line/70 bg-panel/60 px-2 py-1 font-mono text-[10px] text-ink-dim">
          data-quality=&quot;{quality}&quot;
        </code>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <HudPanel eyebrow="Risk matrix" title="Badge risiko">
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                Tweak
              </p>
              <div className="flex flex-wrap gap-2">
                {tweakRisks.map((risk) => (
                  <RiskBadge key={risk} risk={risk} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                Debloat
              </p>
              <div className="flex flex-wrap gap-2">
                {debloatRisks.map((risk) => (
                  <RiskBadge key={risk} risk={risk} />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-ink-muted">
            Tingkat risiko selalu tampil dengan ikon dan label teks, bukan warna
            saja.
          </p>
        </HudPanel>

        <HudPanel
          eyebrow="Controls"
          title="Tombol"
          action={
            <Button variant="ghost" size="sm">
              Reset
            </Button>
          }
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button>Terapkan</Button>
            <Button variant="secondary">Dry-run</Button>
            <Button variant="ghost">Batal</Button>
            <Button variant="danger">Hapus paket</Button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Nonaktif</Button>
          </div>
          <p className="mt-4 text-xs leading-5 text-ink-muted">
            Semua aksi bisa dicapai dengan keyboard dan memiliki fokus yang
            terlihat.
          </p>
        </HudPanel>

        <HudPanel
          eyebrow="Telemetry"
          title="Gauge statis"
          className="lg:col-span-2"
        >
          <div className="grid gap-8 sm:grid-cols-3">
            <Gauge label="RAM terpakai" value={62} unit="%" />
            <Gauge
              label="Penyimpanan"
              value={71}
              unit="%"
              tone="caution"
              caption="Contoh nilai statis"
            />
            <Gauge
              label="Suhu baterai"
              value={38}
              max={60}
              unit="°C"
              tone="danger"
              caption="Contoh nilai statis"
            />
          </div>
        </HudPanel>
      </div>
    </section>
  );
}
