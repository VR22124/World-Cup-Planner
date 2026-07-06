import { describe, it, expect, vi } from "vitest";
import { buildStadiumContext } from "./aiService";

// Mock the simulator
vi.mock("./stadiumSimulator.js", () => ({
  getStadiumStatus: () => ({
    matchStatus: { homeTeam: "A", awayTeam: "B", homeScore: 0, awayScore: 0, minute: 10, phase: "first_half" },
    totalAttendance: 50000,
    capacityPercent: 80,
    overallCrowdLevel: "high",
    weather: { condition: "Clear", temperatureCelsius: 20, humidity: 50, windKph: 10, uvIndex: 2 }
  }),
  getGates: () => [
    { name: "Gate 1", status: "closed", densityPercent: 100, queueLengthMinutes: 0 },
    { name: "Gate 2", status: "congested", densityPercent: 85, queueLengthMinutes: 15 }
  ],
  getCrowdHeatmap: () => [
    { zoneName: "Zone A", level: "critical", densityPercent: 95 }
  ],
  getTransport: () => [
    { name: "Train", status: "delayed", delayMinutes: 10 }
  ],
  getIncidents: () => [
    { status: "active", severity: "high" }
  ],
  getAlerts: () => [
    { acknowledged: false, level: "critical" }
  ]
}));

import { getOperationalRecommendations } from "./aiService";

describe("aiService", () => {
  it("buildStadiumContext includes closed gates and congested gates", () => {
    const context = buildStadiumContext();
    expect(context).toContain("CLOSED GATES: Gate 1");
    expect(context).toContain("CONGESTED GATES: Gate 2");
    expect(context).toContain("HIGH DENSITY ZONES: Zone A");
    expect(context).toContain("TRANSPORT ISSUES: Train: delayed");
  });

  it("getOperationalRecommendations returns fallback mock data when Google GenAI is unavailable or rate limited", async () => {
    const recommendations = await getOperationalRecommendations();
    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]).toHaveProperty("id");
    expect(recommendations[0]).toHaveProperty("recommendation");
  });
});
