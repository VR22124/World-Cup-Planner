/** @vitest-environment jsdom */
import { describe, it, expect } from "vitest";
import { useIncidentRouting, IncidentRoutingResult, Incident } from "../use-incident-routing";

const mockIncidents: Incident[] = [
  { id: "1", type: "medical", severity: "critical", status: "investigating", location: "Gate A", description: "Medical emergency" },
  { id: "2", type: "security", severity: "high", status: "investigating", location: "Gate B", description: "Security alert" },
  { id: "3", type: "transport", severity: "low", status: "resolved", location: "Metro", description: "Delay resolved" },
  { id: "4", type: "crowd_surge", severity: "medium", status: "monitoring", location: "Section 110", description: "Crowd surge" },
];

describe("useIncidentRouting", () => {
  it("separates active from resolved incidents", () => {
    const result = useIncidentRouting(mockIncidents);
    expect(result.activeIncidents).toHaveLength(3);
    expect(result.resolvedIncidents).toHaveLength(1);
    expect(result.resolvedIncidents[0].id).toBe("3");
  });

  it("isolates critical incidents", () => {
    const result = useIncidentRouting(mockIncidents);
    expect(result.criticalIncidents).toHaveLength(1);
    expect(result.criticalIncidents[0].id).toBe("1");
  });

  it("sorts active incidents by severity when sortBy=severity", () => {
    const result = useIncidentRouting(mockIncidents, "severity");
    const severities = result.activeIncidents.map((i) => i.severity);
    expect(severities[0]).toBe("critical");
    expect(severities[1]).toBe("high");
    expect(severities[2]).toBe("medium");
  });

  it("returns correct total and critical counts", () => {
    const result = useIncidentRouting(mockIncidents);
    expect(result.totalCount).toBe(4);
    expect(result.criticalCount).toBe(1);
  });

  it("handles empty incidents gracefully", () => {
    const result = useIncidentRouting([]);
    expect(result.activeIncidents).toHaveLength(0);
    expect(result.criticalIncidents).toHaveLength(0);
    expect(result.resolvedIncidents).toHaveLength(0);
    expect(result.totalCount).toBe(0);
  });
});
