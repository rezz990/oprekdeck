"use client";

import { useSyncExternalStore } from "react";
import {
  getMotionSnapshot,
  getServerMotionSnapshot,
  setQualityPreference,
  subscribeMotion,
} from "./store";

export function useMotionTier() {
  const state = useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getServerMotionSnapshot,
  );

  return { ...state, setPreference: setQualityPreference };
}
