import { describe, it, expect } from "vitest";
import { getIncidents, getVolunteers, getAlerts } from "./incidents";

describe("Incidents Simulator", () => {
  it("should return valid incidents", () => {
    const incidents = getIncidents();
    expect(incidents).toHaveLength(5);
    expect(incidents[0]!).toHaveProperty("id", "INC-001");
    expect(incidents[0]!).toHaveProperty("type");
    expect(incidents[0]!).toHaveProperty("severity");
  });

  it("should return valid volunteers", () => {
    const volunteers = getVolunteers();
    expect(volunteers).toHaveLength(12);
    expect(volunteers[0]!).toHaveProperty("id", "V001");
    expect(volunteers[0]!.languages.length).toBeGreaterThan(0);
  });

  it("should return valid alerts", () => {
    const alerts = getAlerts();
    expect(alerts).toHaveLength(6);
    expect(alerts[0]!).toHaveProperty("id", "ALT-001");
    expect(alerts[0]!).toHaveProperty("level", "critical");
  });
});
