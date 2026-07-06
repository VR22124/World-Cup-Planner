import { describe, it, expect } from "vitest";
import { timeSeed, seededRandom, varyInRange, crowdLevel } from "./core";

describe("Core Simulator Utils", () => {
  it("should generate a valid timeSeed", () => {
    const seed = timeSeed();
    expect(typeof seed).toBe("number");
  });

  it("should generate seeded random numbers", () => {
    const val1 = seededRandom(12345, 1);
    const val2 = seededRandom(12345, 1);
    expect(val1).toBe(val2);
    expect(val1).toBeGreaterThanOrEqual(0);
    expect(val1).toBeLessThan(1);
  });

  it("should vary in range correctly", () => {
    const val = varyInRange(50, 0, 100, 123, 1);
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThanOrEqual(100);
  });

  it("should return correct crowd level", () => {
    expect(crowdLevel(30)).toBe("low");
    expect(crowdLevel(75)).toBe("moderate");
    expect(crowdLevel(85)).toBe("high");
    expect(crowdLevel(95)).toBe("critical");
  });
});
