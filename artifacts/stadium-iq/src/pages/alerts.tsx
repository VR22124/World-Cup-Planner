import { useListAlerts } from "@workspace/api-client-react"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, AlertCircle, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function LiveAlerts() {
  const { data: alerts } = useListAlerts({ query: { refetchInterval: 15000 } })

  // Sort critical first, then unacknowledged, then by date
  const sortedAlerts = alerts ? [...alerts].sort((a, b) => {
    if (a.level === 'critical' && b.level !== 'critical') return -1
    if (a.level !== 'critical' && b.level === 'critical') return 1
    if (!a.acknowledged && b.acknowledged) return -1
    if (a.acknowledged && !b.acknowledged) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  }) : []

  return (
    <div className="p-6 max-w-[1000px] mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Live Alerts Feed</h1>
        <p className="text-muted-foreground">Real-time operational notifications and warnings.</p>
      </div>

      <div className="flex flex-col gap-4">
        {sortedAlerts.length === 0 ? (
          <div className="text-center p-12 bg-secondary/10 border border-border rounded-xl">
            <p className="text-muted-foreground">No active alerts.</p>
          </div>
        ) : (
          sortedAlerts.map(alert => {
            const isCritical = alert.level === 'critical'
            const isWarning = alert.level === 'warning'
            const isAcknowledged = alert.acknowledged

            return (
              <div 
                key={alert.id} 
                className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 md:items-center justify-between transition-all
                  ${isCritical && !isAcknowledged ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse' : ''}
                  ${isCritical && isAcknowledged ? 'bg-background border-red-500/30' : ''}
                  ${isWarning ? 'bg-background border-amber-500/30' : ''}
                  ${!isCritical && !isWarning ? 'bg-background border-border' : ''}
                  ${isAcknowledged ? 'opacity-70' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 shrink-0 p-2 rounded-full
                    ${isCritical ? 'bg-red-500/20 text-red-500' : ''}
                    ${isWarning ? 'bg-amber-500/20 text-amber-500' : ''}
                    ${!isCritical && !isWarning ? 'bg-blue-500/20 text-blue-500' : ''}
                  `}>
                    {isCritical ? <AlertTriangle className="w-5 h-5" /> : 
                     isWarning ? <AlertCircle className="w-5 h-5" /> : 
                     <Info className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-bold ${isCritical ? 'text-red-500' : ''}`}>{alert.title}</h3>
                      <Badge variant={isCritical ? 'critical' : isWarning ? 'warning' : 'info'} className="uppercase text-[9px] px-1.5 py-0">
                        {alert.level}
                      </Badge>
                      {alert.zone && (
                        <Badge variant="outline" className="font-mono text-[9px] uppercase px-1.5 py-0 bg-secondary/50">
                          Zone: {alert.zone}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0 md:border-l md:border-border/50 md:pl-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                  </div>
                  {isAcknowledged ? (
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Acknowledged</span>
                  ) : (
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider animate-pulse">Active</span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
