import { qualityConfig } from "./config";

export type QualityTier = "high" | "medium" | "low";
export type QualityPreference = QualityTier | "auto";

export type QualitySignals = {
  hardwareConcurrency?: number;
  deviceMemory?: number;
  fps?: number;
};

export function isQualityTier(value: unknown): value is QualityTier {
  return value === "high" || value === "medium" || value === "low";
}

export function parseQualityPreference(
  value: string | null,
): QualityPreference | null {
  if (value === "auto" || isQualityTier(value)) {
    return value;
  }
  return null;
}

export function detectQualityTier({
  hardwareConcurrency,
  deviceMemory,
  fps,
}: QualitySignals): QualityTier {
  const belowLowTier =
    (hardwareConcurrency !== undefined &&
      hardwareConcurrency <= qualityConfig.lowMaxCores) ||
    (deviceMemory !== undefined &&
      deviceMemory <= qualityConfig.lowMaxMemoryGb) ||
    (fps !== undefined && fps < qualityConfig.lowUnderFps);

  if (belowLowTier) {
    return "low";
  }

  const hasSignal =
    hardwareConcurrency !== undefined ||
    deviceMemory !== undefined ||
    fps !== undefined;
  const meetsHighTier =
    (hardwareConcurrency === undefined ||
      hardwareConcurrency >= qualityConfig.highMinCores) &&
    (deviceMemory === undefined ||
      deviceMemory >= qualityConfig.highMinMemoryGb) &&
    (fps === undefined || fps >= qualityConfig.highMinFps);

  return hasSignal && meetsHighTier ? "high" : "medium";
}
