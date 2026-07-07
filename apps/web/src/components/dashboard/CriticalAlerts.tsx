import React from "react";
import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function CriticalAlerts({ alerts }: { alerts: any[] }) {
  if (alerts.length === 0) return null

  return (
    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-4" role="alert" aria-live="assertive">
      <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-red-500 uppercase tracking-wider text-sm">Critical Active Alerts ({alerts.length})</h3>
        <div className="flex flex-col gap-2 mt-2">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center gap-3 text-sm">
              <Badge variant="critical" className="rounded-sm px-1.5 py-0 text-[10px]">{alert.zone || 'GLOBAL'}</Badge>
              <span className="font-medium">{alert.title}</span>
              <span className="text-muted-foreground">- {alert.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
