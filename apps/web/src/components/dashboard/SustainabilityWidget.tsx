import React from "react";
import { Leaf, Zap, Trash2, Wind } from "lucide-react";
import { useGetSustainability } from "@workspace/api-client-react";

export function SustainabilityWidget() {
  const { data, isLoading } = useGetSustainability();

  if (isLoading || !data) {
    return <div className="p-4 border rounded-xl bg-card animate-pulse h-[200px]" />;
  }

  return (
    <div className="p-4 border border-border/50 bg-card rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-semibold tracking-tight">Sustainability & Energy</h2>
        </div>
        <span className="text-xs font-mono text-muted-foreground">REAL-TIME</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Power Grid */}
        <div className="flex flex-col p-3 rounded-lg bg-secondary/20 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium uppercase tracking-wider">Grid Load</span>
          </div>
          <span className="text-2xl font-bold">{data.powerGridLoadPercent.toFixed(1)}%</span>
        </div>

        {/* Renewable Energy */}
        <div className="flex flex-col p-3 rounded-lg bg-secondary/20 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Wind className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium uppercase tracking-wider">Renewables</span>
          </div>
          <span className="text-2xl font-bold text-emerald-500">{data.renewableEnergyUsagePercent.toFixed(1)}%</span>
        </div>

        {/* Waste Management */}
        <div className="flex flex-col p-3 rounded-lg bg-secondary/20 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Trash2 className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium uppercase tracking-wider">Waste Cap</span>
          </div>
          <span className="text-2xl font-bold">{data.wasteManagementCapacityPercent.toFixed(1)}%</span>
        </div>

        {/* Carbon Offset */}
        <div className="flex flex-col p-3 rounded-lg bg-secondary/20 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Leaf className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium uppercase tracking-wider">CO2 Offset</span>
          </div>
          <span className="text-2xl font-bold">{data.carbonOffsetTons} <span className="text-sm font-normal text-muted-foreground">tons</span></span>
        </div>
      </div>
    </div>
  );
}
