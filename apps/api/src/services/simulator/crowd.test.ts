import { describe, it, expect } from "vitest";
import { getGates, getCrowdHeatmap, getAccessibilityInfo } from "./crowd";

describe("Crowd Simulator", () => {
  it("should return correct number of gates", () => {
    const gates = getGates();
    expect(gates).toHaveLength(10);
    expect(gates[0]!).toHaveProperty("id", "G1");
    expect(gates[0]!).toHaveProperty("status");
    expect(gates[0]!).toHaveProperty("densityPercent");
  });

  it("should return crowd heatmap zones", () => {
    const zones = getCrowdHeatmap();
    expect(zones).toHaveLength(16);
    expect(zones[0]!).toHaveProperty("zoneId", "Z-N1");
    expect(zones[0]!.densityPercent).toBeGreaterThanOrEqual(0);
    expect(zones[0]!.densityPercent).toBeLessThanOrEqual(100);
  });

  it("should return accessibility info", () => {
    const info = getAccessibilityInfo();
    expect(info.wheelchairEntrances).toContain("Gate 1 — North Main");
    expect(info.signLanguageServices).toBe(true);
  });
});
