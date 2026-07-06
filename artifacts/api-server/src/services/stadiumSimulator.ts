/**
 * Stadium Simulator — generates realistic live mock data for FIFA World Cup 2026.
 * Data evolves over time using time-based variation so the dashboard feels alive.
 */

export type CrowdLevel = "low" | "moderate" | "high" | "critical";
export type GateStatus = "open" | "congested" | "closed" | "restricted";
export type MatchPhase =
  | "pre_match"
  | "first_half"
  | "half_time"
  | "second_half"
  | "extra_time"
  | "full_time";
export type TransportStatus = "on_time" | "delayed" | "disrupted" | "suspended";
export type IncidentType =
  | "medical"
  | "security"
  | "crowd_surge"
  | "infrastructure"
  | "weather"
  | "transport";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type VolunteerRole =
  | "gate_marshal"
  | "crowd_guide"
  | "medical"
  | "transport"
  | "accessibility"
  | "general";
export type VolunteerStatus =
  | "available"
  | "assigned"
  | "on_break"
  | "off_duty";
export type AlertLevel = "info" | "warning" | "critical";

// Use current time to vary data (changes every ~30s)
function timeSeed(): number {
  return Math.floor(Date.now() / 30000);
}

function seededRandom(seed: number, offset = 0): number {
  const x = Math.sin(seed + offset) * 10000;
  return x - Math.floor(x);
}

function varyInRange(
  base: number,
  min: number,
  max: number,
  seed: number,
  offset = 0,
): number {
  const variation = (max - min) * seededRandom(seed, offset);
  return Math.min(
    max,
    Math.max(min, Math.round(base + variation - (max - min) / 2)),
  );
}

function crowdLevel(pct: number): CrowdLevel {
  if (pct >= 90) return "critical";
  if (pct >= 70) return "high";
  if (pct >= 40) return "moderate";
  return "low";
}

function getMatchPhase(): MatchPhase {
  const minuteOfDay = new Date().getMinutes() + new Date().getHours() * 60;
  const phases: MatchPhase[] = [
    "pre_match",
    "first_half",
    "half_time",
    "second_half",
    "full_time",
  ];
  return phases[Math.floor(minuteOfDay / 30) % phases.length];
}

function getMatchMinute(phase: MatchPhase): number {
  switch (phase) {
    case "pre_match":
      return 0;
    case "first_half":
      return varyInRange(25, 1, 45, timeSeed(), 99);
    case "half_time":
      return 45;
    case "second_half":
      return varyInRange(70, 46, 90, timeSeed(), 98);
    case "extra_time":
      return varyInRange(100, 91, 120, timeSeed(), 97);
    case "full_time":
      return 90;
  }
}

export function getStadiumStatus() {
  const seed = timeSeed();
  const phase = getMatchPhase();
  const minute = getMatchMinute(phase);
  const capacityPercent = varyInRange(82, 65, 97, seed, 1);

  return {
    matchStatus: {
      homeTeam: "Brazil",
      awayTeam: "France",
      homeScore: 2,
      awayScore: 1,
      minute,
      phase,
      venue: "MetLife Stadium, New York",
    },
    weather: {
      condition: "Partly Cloudy",
      temperatureCelsius: varyInRange(24, 19, 31, seed, 2),
      humidity: varyInRange(62, 45, 80, seed, 3),
      windKph: varyInRange(12, 5, 28, seed, 4),
      uvIndex: varyInRange(6, 3, 9, seed, 5),
    },
    overallCrowdLevel: crowdLevel(capacityPercent),
    totalAttendance: Math.round((capacityPercent / 100) * 82500),
    capacityPercent,
    updatedAt: new Date().toISOString(),
  };
}

export function getGates() {
  const seed = timeSeed();
  const gates = [
    {
      id: "G1",
      name: "Gate 1 — North Main",
      sector: "North",
      base: 88,
      accessible: true,
    },
    {
      id: "G2",
      name: "Gate 2 — North East",
      sector: "North",
      base: 72,
      accessible: false,
    },
    {
      id: "G3",
      name: "Gate 3 — East Upper",
      sector: "East",
      base: 45,
      accessible: false,
    },
    {
      id: "G4",
      name: "Gate 4 — East Lower",
      sector: "East",
      base: 91,
      accessible: true,
    },
    {
      id: "G5",
      name: "Gate 5 — South Main",
      sector: "South",
      base: 60,
      accessible: true,
    },
    {
      id: "G6",
      name: "Gate 6 — South West",
      sector: "South",
      base: 35,
      accessible: false,
    },
    {
      id: "G7",
      name: "Gate 7 — West Upper",
      sector: "West",
      base: 78,
      accessible: false,
    },
    {
      id: "G8",
      name: "Gate 8 — West Lower",
      sector: "West",
      base: 55,
      accessible: true,
    },
    {
      id: "G9",
      name: "Gate 9 — VIP Entry",
      sector: "North",
      base: 20,
      accessible: true,
    },
    {
      id: "G10",
      name: "Gate 10 — Media",
      sector: "East",
      base: 15,
      accessible: false,
    },
  ];

  return gates.map((g, i) => {
    const density = varyInRange(
      g.base,
      Math.max(5, g.base - 20),
      Math.min(100, g.base + 15),
      seed,
      i * 10,
    );
    const status: GateStatus =
      density >= 92 ? "closed" : density >= 80 ? "congested" : "open";
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

export function getTransport() {
  const seed = timeSeed();
  const routes = [
    {
      id: "T1",
      type: "metro" as const,
      name: "Metro Line A — Stadium Direct",
      dest: "Downtown Hub",
      base: "on_time" as const,
      baseDelay: 0,
    },
    {
      id: "T2",
      type: "metro" as const,
      name: "Metro Line B — East Connection",
      dest: "East Terminal",
      base: "delayed" as const,
      baseDelay: 8,
    },
    {
      id: "T3",
      type: "bus" as const,
      name: "Bus Route 42 — North Park & Ride",
      dest: "North Parking",
      base: "on_time" as const,
      baseDelay: 0,
    },
    {
      id: "T4",
      type: "bus" as const,
      name: "Bus Route 55 — South Zone",
      dest: "South Hub",
      base: "delayed" as const,
      baseDelay: 15,
    },
    {
      id: "T5",
      type: "shuttle" as const,
      name: "Shuttle A — Hotel District",
      dest: "Marriott Cluster",
      base: "on_time" as const,
      baseDelay: 0,
    },
    {
      id: "T6",
      type: "shuttle" as const,
      name: "Shuttle B — Airport Express",
      dest: "JFK Terminal 4",
      base: "disrupted" as const,
      baseDelay: 35,
    },
    {
      id: "T7",
      type: "taxi" as const,
      name: "Official Taxi Zone",
      dest: "Drop-off Zone C",
      base: "on_time" as const,
      baseDelay: 0,
    },
    {
      id: "T8",
      type: "walking" as const,
      name: "Fan Walk — North Pedestrian",
      dest: "North Gate Plaza",
      base: "on_time" as const,
      baseDelay: 0,
    },
  ];

  const nowMinutes = new Date().getMinutes();
  return routes.map((r, i) => {
    const delay =
      r.baseDelay > 0
        ? varyInRange(
            r.baseDelay,
            Math.max(0, r.baseDelay - 5),
            r.baseDelay + 10,
            seed,
            i * 13,
          )
        : 0;
    const status: TransportStatus =
      delay === 0 ? "on_time" : delay > 30 ? "disrupted" : "delayed";
    const nextMins = varyInRange(8, 3, 20, seed, i * 14);
    const nextDep = new Date(Date.now() + nextMins * 60000);
    return {
      id: r.id,
      type: r.type,
      name: r.name,
      status,
      delayMinutes: delay,
      nextDeparture: nextDep.toISOString(),
      destination: r.dest,
      crowdLevel: crowdLevel(varyInRange(60, 30, 95, seed, i * 15)) as
        | "low"
        | "moderate"
        | "high",
    };
  });
}

export function getIncidents() {
  const now = new Date();
  const seed = timeSeed();

  const base = [
    {
      id: "INC-001",
      type: "crowd_surge" as IncidentType,
      severity: "high" as IncidentSeverity,
      location: "Gate 4 — East Lower",
      description:
        "Crowd surge forming near Gate 4 ahead of half-time. Estimated 400 fans converging.",
      status: "active" as const,
      minutesAgo: 8,
      volunteers: 4,
    },
    {
      id: "INC-002",
      type: "medical" as IncidentType,
      severity: "medium" as IncidentSeverity,
      location: "Section E12, Row 24",
      description: "Fan reported heat exhaustion. Medical team responding.",
      status: "resolving" as const,
      minutesAgo: 22,
      volunteers: 2,
    },
    {
      id: "INC-003",
      type: "transport" as IncidentType,
      severity: "medium" as IncidentSeverity,
      location: "Shuttle Zone B — Airport Express",
      description:
        "Shuttle service disrupted due to route obstruction. Alternative routing in progress.",
      status: "active" as const,
      minutesAgo: 35,
      volunteers: 3,
    },
    {
      id: "INC-004",
      type: "security" as IncidentType,
      severity: "low" as IncidentSeverity,
      location: "Concourse North — Food Court A",
      description:
        "Minor altercation between spectators resolved by security. No injuries.",
      status: "resolved" as const,
      minutesAgo: 55,
      volunteers: 0,
    },
    {
      id: "INC-005",
      type: "infrastructure" as IncidentType,
      severity: "low" as IncidentSeverity,
      location: "Restroom Block D",
      description:
        "Facilities maintenance required. Temporary closure of 2 stalls.",
      status: "resolving" as const,
      minutesAgo: 18,
      volunteers: 1,
    },
  ];

  return base.map((inc) => ({
    id: inc.id,
    type: inc.type,
    severity: inc.severity,
    location: inc.location,
    description: inc.description,
    status: inc.status,
    reportedAt: new Date(now.getTime() - inc.minutesAgo * 60000).toISOString(),
    volunteersAssigned: inc.volunteers,
  }));
}

export function getVolunteers() {
  const seed = timeSeed();
  const volunteers = [
    {
      id: "V001",
      name: "Maria Santos",
      role: "gate_marshal" as VolunteerRole,
      zone: "North",
      langs: ["English", "Portuguese", "Spanish"],
    },
    {
      id: "V002",
      name: "Kenji Yamamoto",
      role: "crowd_guide" as VolunteerRole,
      zone: "East",
      langs: ["English", "Japanese"],
    },
    {
      id: "V003",
      name: "Amara Diallo",
      role: "medical" as VolunteerRole,
      zone: "Medical Zone",
      langs: ["English", "French", "Wolof"],
    },
    {
      id: "V004",
      name: "Lucas Weber",
      role: "transport" as VolunteerRole,
      zone: "South",
      langs: ["English", "German"],
    },
    {
      id: "V005",
      name: "Priya Sharma",
      role: "accessibility" as VolunteerRole,
      zone: "West",
      langs: ["English", "Hindi", "Tamil"],
    },
    {
      id: "V006",
      name: "Carlos Mendez",
      role: "gate_marshal" as VolunteerRole,
      zone: "East",
      langs: ["English", "Spanish"],
    },
    {
      id: "V007",
      name: "Sophie Chen",
      role: "crowd_guide" as VolunteerRole,
      zone: "North",
      langs: ["English", "Mandarin", "Cantonese"],
    },
    {
      id: "V008",
      name: "Ahmed Hassan",
      role: "general" as VolunteerRole,
      zone: "Concourse",
      langs: ["English", "Arabic"],
    },
    {
      id: "V009",
      name: "Elena Petrova",
      role: "accessibility" as VolunteerRole,
      zone: "South",
      langs: ["English", "Russian"],
    },
    {
      id: "V010",
      name: "James Okafor",
      role: "medical" as VolunteerRole,
      zone: "Medical Zone",
      langs: ["English", "Igbo", "Yoruba"],
    },
    {
      id: "V011",
      name: "Hana Novak",
      role: "gate_marshal" as VolunteerRole,
      zone: "West",
      langs: ["English", "Czech", "Slovak"],
    },
    {
      id: "V012",
      name: "Omar Al-Rashid",
      role: "transport" as VolunteerRole,
      zone: "Transport Hub",
      langs: ["English", "Arabic", "French"],
    },
  ];

  const statuses: VolunteerStatus[] = [
    "available",
    "assigned",
    "on_break",
    "off_duty",
  ];
  const tasks = [
    "Managing Gate 4 crowd flow",
    "Directing fans to accessible entrance",
    "Assisting medical response at Section E12",
    "Airport shuttle coordination",
    "Crowd monitoring at Food Court A",
    null,
    null,
    "Language assistance — Gate 2 queue",
  ];

  return volunteers.map((v, i) => {
    const statusIdx = Math.floor(seededRandom(seed, i * 20) * 4);
    const status = statuses[Math.min(3, Math.max(0, statusIdx))];
    const taskIdx = Math.floor(seededRandom(seed, i * 21) * tasks.length);
    return {
      id: v.id,
      name: v.name,
      role: v.role,
      zone: v.zone,
      status,
      languages: v.langs,
      currentTask: status === "assigned" ? (tasks[taskIdx] ?? tasks[0]) : null,
    };
  });
}

export function getAlerts() {
  const now = new Date();
  return [
    {
      id: "ALT-001",
      level: "critical" as AlertLevel,
      title: "Gate 4 Approaching Capacity",
      message:
        "Gate 4 East Lower is at 91% capacity. Redirect arriving spectators to Gate 6 or Gate 7 immediately.",
      zone: "East",
      createdAt: new Date(now.getTime() - 5 * 60000).toISOString(),
      acknowledged: false,
    },
    {
      id: "ALT-002",
      level: "warning" as AlertLevel,
      title: "Metro Line B Delayed",
      message:
        "Metro Line B running 8 minutes behind schedule. Advise fans to allow extra travel time post-match.",
      zone: "Transport Hub",
      createdAt: new Date(now.getTime() - 12 * 60000).toISOString(),
      acknowledged: false,
    },
    {
      id: "ALT-003",
      level: "critical" as AlertLevel,
      title: "Airport Shuttle Disruption",
      message:
        "Shuttle B to JFK Terminal 4 is disrupted. Activate alternate route via Shuttle C. ETA recovery: 35 mins.",
      zone: "South",
      createdAt: new Date(now.getTime() - 35 * 60000).toISOString(),
      acknowledged: true,
    },
    {
      id: "ALT-004",
      level: "warning" as AlertLevel,
      title: "Food Court A Overcrowding",
      message:
        "Food Court A at 95% capacity. Consider temporary queue management measures.",
      zone: "Concourse North",
      createdAt: new Date(now.getTime() - 18 * 60000).toISOString(),
      acknowledged: false,
    },
    {
      id: "ALT-005",
      level: "info" as AlertLevel,
      title: "Half-Time Crowd Movement Expected",
      message:
        "First half ending in approximately 8 minutes. Prepare all concourse areas for peak crowd movement.",
      zone: null,
      createdAt: new Date(now.getTime() - 2 * 60000).toISOString(),
      acknowledged: false,
    },
    {
      id: "ALT-006",
      level: "info" as AlertLevel,
      title: "Weather Advisory",
      message:
        "UV index at 6 — medical stations stocked with sunscreen. Remind fans via PA.",
      zone: null,
      createdAt: new Date(now.getTime() - 45 * 60000).toISOString(),
      acknowledged: true,
    },
  ];
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

// just comment
