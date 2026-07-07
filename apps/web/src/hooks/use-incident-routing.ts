/**
 * @layer client
 * useIncidentRouting — Incident filtering and sorting hook.
 *
 * Encapsulates the logic for filtering and prioritising incidents.
 * Components import this hook to get pre-processed incident data
 * rather than applying filter/sort logic inline.
 */

export type IncidentSortKey = "severity" | "status" | "createdAt";

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export interface Incident {
  id: string;
  type: string;
  severity: string;
  status: string;
  location: string;
  description: string;
  createdAt?: string;
}

export interface IncidentRoutingResult {
  activeIncidents: Incident[];
  criticalIncidents: Incident[];
  resolvedIncidents: Incident[];
  totalCount: number;
  criticalCount: number;
}

/**
 * Processes a raw incidents list into UI-ready slices.
 * @param incidents Raw incidents from the API
 * @param sortBy Field to sort active incidents by (default: severity)
 */
export function useIncidentRouting(
  incidents: Incident[] = [],
  sortBy: IncidentSortKey = "severity",
): IncidentRoutingResult {
  const activeIncidents = incidents
    .filter((i) => i.status !== "resolved")
    .sort((a, b) => {
      if (sortBy === "severity") {
        return (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99);
      }
      return 0;
    });

  const criticalIncidents = activeIncidents.filter(
    (i) => i.severity === "critical",
  );

  const resolvedIncidents = incidents.filter((i) => i.status === "resolved");

  return {
    activeIncidents,
    criticalIncidents,
    resolvedIncidents,
    totalCount: incidents.length,
    criticalCount: criticalIncidents.length,
  };
}
