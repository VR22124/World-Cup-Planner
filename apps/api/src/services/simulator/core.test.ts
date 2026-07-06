import { describe, it, expect } from "vitest";
import { timeSeed, seededRandom, varyInRange, crowdLevel } from "./core";

describe("Core Simulator Utils", () => {
  it("should generate a valid timeSeed", () => {
    const seed = timeSeed();
    expect(typeof seed).toBe("number");
    expect(seed).toBeGreaterThan(0);
  });

  it("should generate deterministic seeded random numbers", () => {
    const val1 = seededRandom(12345, 1);
    const val2 = seededRandom(12345, 1);
    // Same seed + offset must always produce the same result
    expect(val1).toBe(val2);
    expect(val1).toBeGreaterThanOrEqual(0);
    expect(val1).toBeLessThan(1);
  });

  it("should produce different values for different offsets", () => {
    const val1 = seededRandom(12345, 1);
    const val2 = seededRandom(12345, 2);
    expect(val1).not.toBe(val2);
  });

  it("should vary in range correctly", () => {
    const val = varyInRange(50, 0, 100, 123, 1);
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThanOrEqual(100);
  });

  it("should clamp values to min/max bounds", () => {
    // Even with extreme base values, result stays within [min, max]
    const low = varyInRange(0, 10, 20, 999, 1);
    expect(low).toBeGreaterThanOrEqual(10);
    expect(low).toBeLessThanOrEqual(20);
  });

  it("should return correct crowd level for each threshold", () => {
    // < 40 → low
    expect(crowdLevel(0)).toBe("low");
    expect(crowdLevel(39)).toBe("low");
    // 40–69 → moderate
    expect(crowdLevel(40)).toBe("moderate");
    expect(crowdLevel(69)).toBe("moderate");
    // 70–89 → high
    expect(crowdLevel(70)).toBe("high");
    expect(crowdLevel(89)).toBe("high");
    // ≥ 90 → critical
    expect(crowdLevel(90)).toBe("critical");
    expect(crowdLevel(100)).toBe("critical");
  });
});
