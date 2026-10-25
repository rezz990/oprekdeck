export const qualityConfig = {
  lowMaxCores: 4,
  lowMaxMemoryGb: 4,
  lowUnderFps: 30,
  highMinCores: 8,
  highMinMemoryGb: 8,
  highMinFps: 55,
  probeDurationMs: 1000,
  storageKey: "oprekdeck.quality-tier",
} as const;
