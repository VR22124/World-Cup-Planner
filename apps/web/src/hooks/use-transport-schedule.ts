/**
 * @layer client
 * useTransportSchedule — Transport data transformation hook.
 *
 * Encapsulates fetching and shaping transport data.
 * Components receive clean, derived data — never raw API responses.
 */

import { useListTransport } from "@workspace/api-client-react";

export interface TransportSummary {
  onTimeCount: number;
  delayedCount: number;
  disruptedCount: number;
  totalCount: number;
  /** All transport options, with a derived `isDelayed` flag */
  routes: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    delayMinutes: number;
    nextDeparture: string | undefined;
    isDelayed: boolean;
    isSuspended: boolean;
  }>;
  isLoading: boolean;
}

/**
 * Fetches and transforms the live transit schedule.
 * Components that need transport data import this hook rather than
 * calling `useListTransport` and doing inline filtering.
 */
export function useTransportSchedule(): TransportSummary {
  const { data: transport = [], isLoading } = useListTransport();

  const routes = transport.map((t) => ({
    id: t.id,
    name: t.name,
    type: t.type,
    status: t.status,
    delayMinutes: t.delayMinutes ?? 0,
    nextDeparture: t.nextDeparture ?? undefined,
    isDelayed: t.status !== "on_time" && t.status !== "suspended",
    isSuspended: t.status === "suspended",
  }));

  const onTimeCount = routes.filter((r) => !r.isDelayed && !r.isSuspended).length;
  const delayedCount = routes.filter((r) => r.isDelayed).length;
  const disruptedCount = routes.filter((r) => r.isSuspended).length;

  return {
    onTimeCount,
    delayedCount,
    disruptedCount,
    totalCount: routes.length,
    routes,
    isLoading,
  };
}
