import { qualityConfig } from "./config";
import {
  detectQualityTier,
  parseQualityPreference,
  type QualityPreference,
  type QualitySignals,
  type QualityTier,
} from "./detect";

export type MotionState = {
  tier: QualityTier;
  preference: QualityPreference;
  reduceMotion: boolean;
  fps: number | null;
  ready: boolean;
};

const SERVER_STATE: MotionState = {
  tier: "high",
  preference: "auto",
  reduceMotion: false,
  fps: null,
  ready: false,
};

let state: MotionState = SERVER_STATE;
let initialized = false;
let probing = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function applyMotionAttributes() {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.dataset.quality = state.tier;
  document.documentElement.dataset.motion = state.reduceMotion
    ? "reduced"
    : "full";
}

function readHardwareSignals(): QualitySignals {
  if (typeof navigator === "undefined") {
    return {};
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
  };
}

function readStoredPreference(): QualityPreference | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return parseQualityPreference(
      window.localStorage.getItem(qualityConfig.storageKey),
    );
  } catch {
    return null; // localStorage can be unavailable in private or embedded contexts
  }
}

function persistPreference(preference: QualityPreference) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (preference === "auto") {
      window.localStorage.removeItem(qualityConfig.storageKey);
    } else {
      window.localStorage.setItem(qualityConfig.storageKey, preference);
    }
  } catch {
    // Storage can be blocked; the tier still applies for this session.
  }
}

function measureFrameRate(durationMs: number): Promise<number> {
  return new Promise((resolve) => {
    if (
      typeof document === "undefined" ||
      document.visibilityState !== "visible"
    ) {
      resolve(0);
      return;
    }

    let frames = 0;
    let done = false;
    let timeout = 0;
    const start = performance.now();

    const finish = (fps: number) => {
      if (done) {
        return;
      }
      done = true;
      window.clearTimeout(timeout);
      resolve(fps);
    };

    const tick = (now: number) => {
      if (done) {
        return;
      }
      frames += 1;
      const elapsed = now - start;
      if (elapsed >= durationMs) {
        finish((frames * 1000) / Math.max(elapsed, 1));
        return;
      }
      window.requestAnimationFrame(tick);
    };

    timeout = window.setTimeout(() => finish(0), durationMs + 750);
    window.requestAnimationFrame(tick);
  });
}

function refineAutomatically() {
  if (
    probing ||
    typeof document === "undefined" ||
    document.visibilityState !== "visible"
  ) {
    return;
  }
  probing = true;

  void measureFrameRate(qualityConfig.probeDurationMs).then((fps) => {
    probing = false;
    if (state.preference !== "auto") {
      return;
    }
    if (
      typeof document === "undefined" ||
      document.visibilityState !== "visible" ||
      fps <= 0
    ) {
      return;
    }
    state = {
      ...state,
      fps: Math.round(fps),
      tier: detectQualityTier({ ...readHardwareSignals(), fps }),
    };
    applyMotionAttributes();
    emit();
  });
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") {
    return;
  }
  initialized = true;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stored = readStoredPreference();
  const preference: QualityPreference = stored ?? "auto";
  const tier =
    preference === "auto"
      ? detectQualityTier(readHardwareSignals())
      : preference;

  state = {
    tier,
    preference,
    reduceMotion: motionQuery.matches,
    fps: null,
    ready: true,
  };
  applyMotionAttributes();

  motionQuery.addEventListener("change", (event) => {
    state = { ...state, reduceMotion: event.matches };
    applyMotionAttributes();
    emit();
  });

  document.addEventListener("visibilitychange", () => {
    if (
      document.visibilityState === "visible" &&
      state.preference === "auto" &&
      state.fps === null
    ) {
      refineAutomatically();
    }
  });

  emit();

  if (preference === "auto") {
    refineAutomatically();
  }
}

export function subscribeMotion(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  listeners.add(listener);
  ensureInitialized();
  return () => {
    listeners.delete(listener);
  };
}

export function getMotionSnapshot(): MotionState {
  return state;
}

export function getServerMotionSnapshot(): MotionState {
  return SERVER_STATE;
}

export function setQualityPreference(preference: QualityPreference) {
  ensureInitialized();
  persistPreference(preference);

  if (preference === "auto") {
    state = {
      ...state,
      preference,
      tier: detectQualityTier(readHardwareSignals()),
      fps: null,
    };
    applyMotionAttributes();
    emit();
    refineAutomatically();
    return;
  }

  state = {
    ...state,
    preference,
    tier: preference,
    fps: null,
  };
  applyMotionAttributes();
  emit();
}
