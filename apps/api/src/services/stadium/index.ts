/**
 * @layer server
 * Stadium Service Facade — Domain Service Layer
 *
 * This module is the single authoritative interface for all stadium simulation
 * data. Route handlers MUST import from here; they never import simulator
 * modules directly. This enforces the two-layer contract:
 *   HTTP Transport → Domain Service → (Data if needed)
 *
 * NO Express imports are permitted in this file or any module it re-exports.
 */

export {
  getStadiumStatus,
  getGates,
  getCrowdHeatmap,
  getTransport,
  getIncidents,
  getVolunteers,
  getAlerts,
  getAccessibilityInfo,
  getSustainabilityMetrics,
  // Core type utilities
  type CrowdLevel,
  type GateStatus,
  type MatchPhase,
  type TransportStatus,
  type IncidentType,
  type IncidentSeverity,
  type VolunteerRole,
  type VolunteerStatus,
  type AlertLevel,
} from "../stadiumSimulator.js";
