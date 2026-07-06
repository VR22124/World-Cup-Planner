/**
 * Core simulator utilities — provides deterministic, time-varying
 * pseudo-random data generation for stadium simulation.
 *
 * The `timeSeed()` function produces values that change every ~30 seconds,
 * giving the illusion of a live data feed without external dependencies.
 */

// ---------------------------------------------------------------------------
// Domain types shared across all simulator modules
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Deterministic pseudo-random utilities
// ---------------------------------------------------------------------------

/**
 * Generates a seed that changes every ~30 seconds.
 * Used to make simulated data shift realistically over time.
 */
export function timeSeed(): number {
  return Math.floor(Date.now() / 30_000);
}

/**
 * Returns a deterministic pseudo-random float in [0, 1) for a given seed+offset.
 * Same inputs always produce the same output (pure function).
 */
export function seededRandom(seed: number, offset = 0): number {
  const x = Math.sin(seed + offset) * 10_000;
  return x - Math.floor(x);
}

/**
 * Produces a clamped integer within [min, max] that varies around `base`
 * according to the seed and offset. Useful for simulating fluctuating metrics.
 */
export function varyInRange(
  base: number,
  min: number,
  max: number,
  seed: number,
  offset = 0,
): number {
  const variation = (max - min) * seededRandom(seed, offset);
  return Math.min(max, Math.max(min, Math.round(base + variation - (max - min) / 2)));
}

/**
 * Maps a density percentage to a human-readable crowd level.
 *
 * | Range    | Level      |
 * | -------- | ---------- |
 * | ≥ 90 %   | critical   |
 * | ≥ 70 %   | high       |
 * | ≥ 40 %   | moderate   |
 * | < 40 %   | low        |
 */
export function crowdLevel(pct: number): CrowdLevel {
  if (pct >= 90) return "critical";
  if (pct >= 70) return "high";
  if (pct >= 40) return "moderate";
  return "low";
}
