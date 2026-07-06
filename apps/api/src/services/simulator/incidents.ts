import { timeSeed, seededRandom, type IncidentType, type IncidentSeverity, type VolunteerRole, type VolunteerStatus, type AlertLevel } from "./core";

export function getIncidents() {
  const now = new Date();

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
    { id: "V001", name: "Maria Santos", role: "gate_marshal" as VolunteerRole, zone: "North", langs: ["English", "Portuguese", "Spanish"] },
    { id: "V002", name: "Kenji Yamamoto", role: "crowd_guide" as VolunteerRole, zone: "East", langs: ["English", "Japanese"] },
    { id: "V003", name: "Amara Diallo", role: "medical" as VolunteerRole, zone: "Medical Zone", langs: ["English", "French", "Wolof"] },
    { id: "V004", name: "Lucas Weber", role: "transport" as VolunteerRole, zone: "South", langs: ["English", "German"] },
    { id: "V005", name: "Priya Sharma", role: "accessibility" as VolunteerRole, zone: "West", langs: ["English", "Hindi", "Tamil"] },
    { id: "V006", name: "Carlos Mendez", role: "gate_marshal" as VolunteerRole, zone: "East", langs: ["English", "Spanish"] },
    { id: "V007", name: "Sophie Chen", role: "crowd_guide" as VolunteerRole, zone: "North", langs: ["English", "Mandarin", "Cantonese"] },
    { id: "V008", name: "Ahmed Hassan", role: "general" as VolunteerRole, zone: "Concourse", langs: ["English", "Arabic"] },
    { id: "V009", name: "Elena Petrova", role: "accessibility" as VolunteerRole, zone: "South", langs: ["English", "Russian"] },
    { id: "V010", name: "James Okafor", role: "medical" as VolunteerRole, zone: "Medical Zone", langs: ["English", "Igbo", "Yoruba"] },
    { id: "V011", name: "Hana Novak", role: "gate_marshal" as VolunteerRole, zone: "West", langs: ["English", "Czech", "Slovak"] },
    { id: "V012", name: "Omar Al-Rashid", role: "transport" as VolunteerRole, zone: "Transport Hub", langs: ["English", "Arabic", "French"] },
  ];

  const statuses: VolunteerStatus[] = ["available", "assigned", "on_break", "off_duty"];
  const tasks = [
    "Managing Gate 4 crowd flow",
    "Directing fans to accessible entrance",
    "Assisting medical response at Section E12",
    "Airport shuttle coordination",
    "Crowd monitoring at Food Court A",
    null, null,
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
    { id: "ALT-001", level: "critical" as AlertLevel, title: "Gate 4 Approaching Capacity", message: "Gate 4 East Lower is at 91% capacity. Redirect arriving spectators to Gate 6 or Gate 7 immediately.", zone: "East", createdAt: new Date(now.getTime() - 5 * 60000).toISOString(), acknowledged: false },
    { id: "ALT-002", level: "warning" as AlertLevel, title: "Metro Line B Delayed", message: "Metro Line B running 8 minutes behind schedule. Advise fans to allow extra travel time post-match.", zone: "Transport Hub", createdAt: new Date(now.getTime() - 12 * 60000).toISOString(), acknowledged: false },
    { id: "ALT-003", level: "critical" as AlertLevel, title: "Airport Shuttle Disruption", message: "Shuttle B to JFK Terminal 4 is disrupted. Activate alternate route via Shuttle C. ETA recovery: 35 mins.", zone: "South", createdAt: new Date(now.getTime() - 35 * 60000).toISOString(), acknowledged: true },
    { id: "ALT-004", level: "warning" as AlertLevel, title: "Food Court A Overcrowding", message: "Food Court A at 95% capacity. Consider temporary queue management measures.", zone: "Concourse North", createdAt: new Date(now.getTime() - 18 * 60000).toISOString(), acknowledged: false },
    { id: "ALT-005", level: "info" as AlertLevel, title: "Half-Time Crowd Movement Expected", message: "First half ending in approximately 8 minutes. Prepare all concourse areas for peak crowd movement.", zone: null, createdAt: new Date(now.getTime() - 2 * 60000).toISOString(), acknowledged: false },
    { id: "ALT-006", level: "info" as AlertLevel, title: "Weather Advisory", message: "UV index at 6 — medical stations stocked with sunscreen. Remind fans via PA.", zone: null, createdAt: new Date(now.getTime() - 45 * 60000).toISOString(), acknowledged: true },
  ];
}
