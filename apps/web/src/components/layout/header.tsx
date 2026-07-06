import * as React from "react"
import { useGetStadiumStatus } from "@workspace/api-client-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, ThermometerSun, Wind, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const { data: status, isLoading } = useGetStadiumStatus()

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10" role="banner">
      <nav className="flex w-full items-center justify-between" aria-label="Main Navigation">
      {isLoading || !status ? (
        <div className="flex w-full items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">{status.matchStatus.homeTeam}</span>
              <div className="bg-background border border-border px-3 py-1 rounded font-mono text-xl tracking-widest font-bold">
                {status.matchStatus.homeScore} - {status.matchStatus.awayScore}
              </div>
              <span className="font-bold text-lg">{status.matchStatus.awayTeam}</span>
              <div className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-500 border border-red-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                {status.matchStatus.minute}'
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-4 text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-md border border-border/50">
              <div className="flex items-center gap-1.5">
                <ThermometerSun className="w-4 h-4" />
                <span className="font-mono">{status.weather.temperatureCelsius}°C</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4" />
                <span className="font-mono">{status.weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="w-4 h-4" />
                <span className="font-mono">{status.weather.windKph}km/h</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground leading-none">Attendance</span>
                <span className="font-mono font-bold leading-none mt-0.5">
                  {status.totalAttendance.toLocaleString()}
                  <span className="text-muted-foreground ml-1 font-normal text-[10px]">
                    ({status.capacityPercent}%)
                  </span>
                </span>
              </div>
            </div>
            
            <div className={cn(
              "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
              status.overallCrowdLevel === 'low' && "bg-green-500/20 text-green-500",
              status.overallCrowdLevel === 'moderate' && "bg-amber-500/20 text-amber-500",
              status.overallCrowdLevel === 'high' && "bg-orange-500/20 text-orange-500",
              status.overallCrowdLevel === 'critical' && "bg-red-500/20 text-red-500 animate-pulse"
            )}>
              {status.overallCrowdLevel}
            </div>
          </div>
        </>
      )}
      </nav>
    </header>
  )
}
