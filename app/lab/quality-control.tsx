"use client";

import { Button } from "@/components/ui/button";
import { HudPanel } from "@/components/ui/panel";
import type { QualityPreference } from "@/lib/quality/detect";
import { useMotionTier } from "@/lib/quality/use-motion-tier";

const tierOptions: Array<{ value: QualityPreference; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function QualityControl() {
  const { tier, preference, reduceMotion, fps, ready, setPreference } =
    useMotionTier();

  return (
    <HudPanel
      eyebrow="Quality system"
      title="Tier kualitas dan motion"
      action={
        <span
          aria-live="polite"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim"
        >
          {ready ? `${tier} aktif` : "Mendeteksi…"}
        </span>
      }
    >
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Pilih tier kualitas"
      >
        {tierOptions.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant={preference === option.value ? "primary" : "secondary"}
            aria-pressed={preference === option.value}
            onClick={() => setPreference(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <dl className="mt-5 grid gap-3 font-mono text-[10px] uppercase tracking-[0.14em] sm:grid-cols-3">
        <div>
          <dt className="text-ink-dim">Mode</dt>
          <dd className="mt-1 text-ink">
            {preference === "auto" ? "Otomatis" : "Manual"}
          </dd>
        </div>
        <div>
          <dt className="text-ink-dim">FPS probe</dt>
          <dd className="mt-1 text-ink">
            {fps === null ? "—" : `${fps} fps`}
          </dd>
        </div>
        <div>
          <dt className="text-ink-dim">Reduced motion</dt>
          <dd className="mt-1 text-ink">
            {reduceMotion ? "Aktif" : "Nonaktif"}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs leading-5 text-ink-muted">
        Pilihan manual disimpan di browser dan dipakai lagi saat halaman dimuat.
        Mode auto memakai hardwareConcurrency, deviceMemory, dan probe FPS 1
        detik.
      </p>
    </HudPanel>
  );
}
