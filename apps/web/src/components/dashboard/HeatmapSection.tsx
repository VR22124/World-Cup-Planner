import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Map, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeatmapSection({ heatmap }: { heatmap: any[] }) {
  return (
    <section aria-labelledby="heatmap-title">
      <Card className="border-border/50 shadow-md">
        <CardHeader className="border-b border-border/30 bg-secondary/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" aria-hidden="true" />
              <CardTitle id="heatmap-title">Sector Heatmap</CardTitle>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">LIVE</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {heatmap?.map(zone => (
              <div 
                key={zone.zoneId} 
                className={cn(
                  "p-3 rounded-md border flex flex-col gap-2 transition-all",
                  zone.level === 'critical' ? "bg-red-500/20 border-red-500/50" :
                  zone.level === 'high' ? "bg-orange-500/20 border-orange-500/50" :
                  zone.level === 'moderate' ? "bg-amber-500/10 border-amber-500/30" :
                  "bg-green-500/5 border-green-500/20"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-sm">{zone.zoneId}</span>
                  {zone.level === 'critical' && <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground truncate">{zone.zoneName}</span>
                  <span className="text-xl font-black mt-1 font-mono tracking-tighter">
                    {zone.densityPercent}%
                  </span>
                </div>
                <Progress 
                  value={zone.densityPercent} 
                  className="h-1 mt-1" 
                  indicatorColor={
                    zone.level === 'critical' ? 'bg-red-500' :
                    zone.level === 'high' ? 'bg-orange-500' :
                    zone.level === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                  }
                />
                <div className="text-[10px] text-muted-foreground font-mono flex justify-between mt-1">
                  <span>{zone.current.toLocaleString()}</span>
                  <span>{zone.capacity.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
