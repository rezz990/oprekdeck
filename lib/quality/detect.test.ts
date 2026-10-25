import { describe, expect, it } from "vitest";
import { detectQualityTier, parseQualityPreference } from "./detect";

describe("detectQualityTier", () => {
  it("returns low for four logical cores or fewer", () => {
    expect(
      detectQualityTier({
        hardwareConcurrency: 4,
        deviceMemory: 8,
        fps: 60,
      }),
    ).toBe("low");
  });

  it("returns low for 4 GB memory or less", () => {
    expect(
      detectQualityTier({
        hardwareConcurrency: 8,
        deviceMemory: 4,
        fps: 60,
      }),
    ).toBe("low");
  });

  it("returns low when the measured frame rate is below 30 fps", () => {
    expect(
      detectQualityTier({
        hardwareConcurrency: 8,
        deviceMemory: 8,
        fps: 29.9,
      }),
    ).toBe("low");
  });

  it("returns high for eight cores, 8 GB, and 55 fps or more", () => {
    expect(
      detectQualityTier({
        hardwareConcurrency: 8,
        deviceMemory: 8,
        fps: 55,
      }),
    ).toBe("high");
  });

  it("returns high from hardware signals before the fps probe finishes", () => {
    expect(
      detectQualityTier({ hardwareConcurrency: 8, deviceMemory: 8 }),
    ).toBe("high");
  });

  it("returns medium for mixed hardware or frame rates between 30 and 54 fps", () => {
    expect(
      detectQualityTier({
        hardwareConcurrency: 6,
        deviceMemory: 8,
        fps: 60,
      }),
    ).toBe("medium");
    expect(
      detectQualityTier({
        hardwareConcurrency: 8,
        deviceMemory: 8,
        fps: 30,
      }),
    ).toBe("medium");
    expect(
      detectQualityTier({
        hardwareConcurrency: 8,
        deviceMemory: 8,
        fps: 54.9,
      }),
    ).toBe("medium");
  });

  it("returns medium when no signal is available", () => {
    expect(detectQualityTier({})).toBe("medium");
  });

  it("accepts a strong fps signal when hardware signals are missing", () => {
    expect(detectQualityTier({ fps: 60 })).toBe("high");
  });
});

describe("parseQualityPreference", () => {
  it("accepts auto and every tier", () => {
    expect(parseQualityPreference("auto")).toBe("auto");
    expect(parseQualityPreference("high")).toBe("high");
    expect(parseQualityPreference("medium")).toBe("medium");
    expect(parseQualityPreference("low")).toBe("low");
  });

  it("rejects unknown or missing values", () => {
    expect(parseQualityPreference("HIGH")).toBeNull();
    expect(parseQualityPreference("ultra")).toBeNull();
    expect(parseQualityPreference(null)).toBeNull();
  });
});
