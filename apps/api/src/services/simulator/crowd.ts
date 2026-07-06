import { timeSeed, varyInRange, crowdLevel, type GateStatus } from "./core.js";

export function getGates() {
  const seed = timeSeed();
  const gates = [
    { id: "G1", name: "Gate 1 — North Main", sector: "North", base: 88, accessible: true },
    { id: "G2", name: "Gate 2 — North East", sector: "North", base: 72, accessible: false },
    { id: "G3", name: "Gate 3 — East Upper", sector: "East", base: 45, accessible: false },
    { id: "G4", name: "Gate 4 — East Lower", sector: "East", base: 91, accessible: true },
    { id: "G5", name: "Gate 5 — South Main", sector: "South", base: 60, accessible: true },
    { id: "G6", name: "Gate 6 — South West", sector: "South", base: 35, accessible: false },
    { id: "G7", name: "Gate 7 — West Upper", sector: "West", base: 78, accessible: false },
    { id: "G8", name: "Gate 8 — West Lower", sector: "West", base: 55, accessible: true },
    { id: "G9", name: "Gate 9 — VIP Entry", sector: "North", base: 20, accessible: true },
    { id: "G10", name: "Gate 10 — Media", sector: "East", base: 15, accessible: false },
  ];

  return gates.map((g, i) => {
    const density = varyInRange(
      g.base,
      Math.max(5, g.base - 20),
      Math.min(100, g.base + 15),
      seed,
      i * 10,
    );
    const status: GateStatus = density >= 92 ? "closed" : density >= 80 ? "congested" : "open";
    return {
      id: g.id,
      name: g.name,
      status,
      densityPercent: density,
      queueLengthMinutes:
        status === "congested"
          ? varyInRange(12, 8, 20, seed, i * 11)
          : status === "open"
            ? varyInRange(3, 1, 6, seed, i * 12)
            : 0,
      sector: g.sector,
      accessibilityEnabled: g.accessible,
    };
  });
}

export function getCrowdHeatmap() {
  const seed = timeSeed();
  const zones = [
    { id: "Z-N1", name: "North Stand Lower", base: 90 },
    { id: "Z-N2", name: "North Stand Upper", base: 75 },
    { id: "Z-E1", name: "East Stand Lower", base: 85 },
    { id: "Z-E2", name: "East Stand Upper", base: 60 },
    { id: "Z-S1", name: "South Stand Lower", base: 80 },
    { id: "Z-S2", name: "South Stand Upper", base: 55 },
    { id: "Z-W1", name: "West Stand Lower", base: 78 },
    { id: "Z-W2", name: "West Stand Upper", base: 65 },
    { id: "Z-C1", name: "Concourse North", base: 92 },
    { id: "Z-C2", name: "Concourse East", base: 70 },
    { id: "Z-C3", name: "Concourse South", base: 68 },
    { id: "Z-C4", name: "Concourse West", base: 50 },
    { id: "Z-F1", name: "Food Court A", base: 95 },
    { id: "Z-F2", name: "Food Court B", base: 88 },
    { id: "Z-M1", name: "Medical Zone", base: 25 },
    { id: "Z-V1", name: "VIP Lounge", base: 40 },
  ];

  return zones.map((z, i) => {
    const capacity = 5000;
    const pct = varyInRange(
      z.base,
      Math.max(10, z.base - 15),
      Math.min(100, z.base + 10),
      seed,
      i * 7 + 100,
    );
    return {
      zoneId: z.id,
      zoneName: z.name,
      densityPercent: pct,
      level: crowdLevel(pct),
      capacity,
      current: Math.round((pct / 100) * capacity),
    };
  });
}

export function getAccessibilityInfo() {
  return {
    wheelchairEntrances: [
      "Gate 1 — North Main",
      "Gate 4 — East Lower",
      "Gate 5 — South Main",
      "Gate 8 — West Lower",
      "Gate 9 — VIP Entry",
    ],
    accessibleRestrooms: [
      "Block A — North Stand",
      "Block D — East Lower",
      "Block G — South Main",
      "Block J — West Lower",
      "Medical Zone Facility",
    ],
    signLanguageServices: true,
    audioDescriptionAvailable: true,
    mobilityAidRental: true,
    dedicatedVolunteers: 8,
    emergencyEvacuationPoints: [
      "North Plaza — Gate 1",
      "East Emergency Exit 3",
      "South Assembly Point B",
      "West Exit — Ramp 7",
    ],
  };
}
