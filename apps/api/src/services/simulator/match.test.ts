import { describe, it, expect } from "vitest";
import { getStadiumStatus } from "./match";

describe("Match Simulator", () => {
  it("should return valid stadium status", () => {
    const status = getStadiumStatus();
    expect(status).toHaveProperty("matchStatus");
    expect(status.matchStatus).toHaveProperty("homeTeam", "Brazil");
    expect(status.matchStatus).toHaveProperty("awayTeam", "France");
    expect(status.matchStatus.minute).toBeGreaterThanOrEqual(0);
    expect(status.matchStatus.minute).toBeLessThanOrEqual(120);
    
    expect(status).toHaveProperty("weather");
    expect(status.weather.temperatureCelsius).toBeGreaterThan(0);
    
    expect(status).toHaveProperty("totalAttendance");
    expect(status.totalAttendance).toBeGreaterThan(0);
  });
});
