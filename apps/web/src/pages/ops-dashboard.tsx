import React from "react";
import { 
  useGetCrowdHeatmap, 
  useListGates, 
  useListIncidents, 
  useListAlerts, 
  useGetOperationalRecommendations
} from "@workspace/api-client-react"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { CriticalAlerts } from "@/components/dashboard/CriticalAlerts"
import { HeatmapSection } from "@/components/dashboard/HeatmapSection"
import { ActiveIncidentsTable } from "@/components/dashboard/ActiveIncidentsTable"
import { GateCongestionTable } from "@/components/dashboard/GateCongestionTable"
import { AiInsights } from "@/components/dashboard/AiInsights"
import { TransportWidget } from "@/components/dashboard/TransportWidget"
import { VolunteerWidget } from "@/components/dashboard/VolunteerWidget"
import { SustainabilityWidget } from "@/components/dashboard/SustainabilityWidget"
import { EmergencyBroadcastWidget } from "@/components/dashboard/EmergencyBroadcastWidget"
import { EvacuationProtocol } from "@/components/dashboard/EvacuationProtocol"

export default function OpsDashboard() {
  const { data: heatmap } = useGetCrowdHeatmap()
  const { data: gates } = useListGates()
  const { data: incidents } = useListIncidents()
  const { data: alerts } = useListAlerts()
  const { data: recommendations, refetch: refetchRecommendations, isFetching: isFetchingRecommendations } = useGetOperationalRecommendations()

  const criticalAlerts = alerts?.filter(a => a.level === 'critical' && !a.acknowledged) || []

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
      >
        Skip to main content
      </a>
      <main id="main-content" className="p-6 max-w-[1600px] mx-auto space-y-6" aria-label="Operations Dashboard">
      <DashboardHeader />

      <CriticalAlerts alerts={criticalAlerts} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column - Realtime Map & Gates */}
        <div className="xl:col-span-3 space-y-6">
          <HeatmapSection heatmap={heatmap || []} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActiveIncidentsTable incidents={incidents || []} />
            <GateCongestionTable gates={gates || []} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TransportWidget />
            <VolunteerWidget />
            <SustainabilityWidget />
          </div>
        </div>

        {/* Right Column - AI Recommendations & Command Protocols */}
        <div className="xl:col-span-1 space-y-6">
          <AiInsights 
            recommendations={recommendations || []}
            refetchRecommendations={refetchRecommendations}
            isFetchingRecommendations={isFetchingRecommendations}
          />
          <EmergencyBroadcastWidget />
          <EvacuationProtocol />
        </div>

      </div>
    </main></>
  )
}
