/**
 * @layer client — Page
 * Operations Dashboard
 *
 * This page is a pure layout and data-routing component.
 * All data fetching is delegated to `useStadiumData`.
 * All business logic (filtering, sorting) is delegated to custom hooks.
 * This file contains zero fetch calls and zero business logic.
 */

import React from "react";
import { useGetOperationalRecommendations } from "@workspace/api-client-react";
import { useStadiumData } from "@/hooks/use-stadium-data";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CriticalAlerts } from "@/components/dashboard/CriticalAlerts";
import { HeatmapSection } from "@/components/dashboard/HeatmapSection";
import { ActiveIncidentsTable } from "@/components/dashboard/ActiveIncidentsTable";
import { GateCongestionTable } from "@/components/dashboard/GateCongestionTable";
import { AiInsights } from "@/components/dashboard/AiInsights";
import { TransportWidget } from "@/components/dashboard/TransportWidget";
import { VolunteerWidget } from "@/components/dashboard/VolunteerWidget";
import { SustainabilityWidget } from "@/components/dashboard/SustainabilityWidget";

export default function OpsDashboard() {
  // All stadium data fetching + derivation is encapsulated in the hook
  const { heatmap, gates, incidents, criticalAlerts } = useStadiumData();

  // AI Insights maintains its own refetch control — isolated from stadium data
  const {
    data: recommendations,
    refetch: refetchRecommendations,
    isFetching: isFetchingRecommendations,
  } = useGetOperationalRecommendations();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        className="p-6 max-w-[1600px] mx-auto space-y-6"
        aria-label="Operations Dashboard"
      >
        <DashboardHeader />

        <CriticalAlerts alerts={criticalAlerts} />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column — Realtime Map & Gates */}
          <div className="xl:col-span-3 space-y-6">
            <HeatmapSection heatmap={heatmap} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActiveIncidentsTable incidents={incidents} />
              <GateCongestionTable gates={gates} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TransportWidget />
              <VolunteerWidget />
              <SustainabilityWidget />
            </div>
          </div>

          {/* Right Column — Gemini AI Operations Assistant */}
          <div className="xl:col-span-1">
            <AiInsights
              recommendations={recommendations || []}
              refetchRecommendations={refetchRecommendations}
              isFetchingRecommendations={isFetchingRecommendations}
            />
          </div>
        </div>
      </main>
    </>
  );
}
