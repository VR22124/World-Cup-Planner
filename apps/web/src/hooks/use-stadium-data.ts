/**
 * @layer client
 * useStadiumData — Aggregated stadium state hook.
 *
 * Provides a single entry point for pages/components that need a broad
 * snapshot of the current stadium state. All data fetching is delegated
 * here; pages receive derived values as props — zero fetch calls in pages.
 *
 * This hook owns data-shaping logic (filtering, sorting) so that
 * components remain pure UI renderers.
 */

import {
  useGetCrowdHeatmap,
  useListGates,
  useListIncidents,
  useListAlerts,
  useGetStadiumStatus,
} from "@workspace/api-client-react";

// Use explicit any[] for compatibility with the components' prop types.
// The generated API hooks use complex inferred generics that collapse to
// `unknown` at the interface boundary — explicit typing is safer here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiArray = any[];

export interface StadiumDataSnapshot {
  heatmap: ApiArray;
  gates: ApiArray;
  incidents: ApiArray;
  alerts: ApiArray;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  status: any | null;
  /** Unacknowledged critical alerts only */
  criticalAlerts: ApiArray;
  /** Active (non-resolved) incidents only */
  activeIncidents: ApiArray;
  isLoading: boolean;
}

/**
 * Aggregated stadium data hook.
 * Pages import this instead of calling individual API hooks.
 */
export function useStadiumData(): StadiumDataSnapshot {
  const { data: heatmap, isLoading: loadingHeatmap } = useGetCrowdHeatmap();
  const { data: gates, isLoading: loadingGates } = useListGates();
  const { data: incidents, isLoading: loadingIncidents } = useListIncidents();
  const { data: alerts, isLoading: loadingAlerts } = useListAlerts();
  const { data: status, isLoading: loadingStatus } = useGetStadiumStatus();

  const alertsArr = (alerts as ApiArray) ?? [];
  const incidentsArr = (incidents as ApiArray) ?? [];

  const criticalAlerts = alertsArr.filter(
    (a: { level: string; acknowledged: boolean }) =>
      a.level === "critical" && !a.acknowledged,
  );

  const activeIncidents = incidentsArr.filter(
    (i: { status: string }) => i.status !== "resolved",
  );

  const isLoading =
    loadingHeatmap || loadingGates || loadingIncidents || loadingAlerts || loadingStatus;

  return {
    heatmap: (heatmap as ApiArray) ?? [],
    gates: (gates as ApiArray) ?? [],
    incidents: incidentsArr,
    alerts: alertsArr,
    status: status ?? null,
    criticalAlerts,
    activeIncidents,
    isLoading,
  };
}
