// @ts-nocheck
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
export function timeSeed(): number {
  return Math.floor(Date.now() / 30000);
}

export function seededRandom(seed: number, offset = 0): number {
  const x = Math.sin(seed + offset) * 10000;
  return x - Math.floor(x);
}

export function varyInRange(
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

export function crowdLevel(pct: number): CrowdLevel {
  if (pct >= 90) return "critical";
  if (pct >= 70) return "high";
  if (pct >= 40) return "moderate";
  return "low";
}
