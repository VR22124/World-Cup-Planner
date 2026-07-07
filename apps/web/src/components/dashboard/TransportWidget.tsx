import React from "react";
import { Train, Bus, Car, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useListTransport } from "@workspace/api-client-react";

export function TransportWidget() {
  const { data: transportOptions, isLoading } = useListTransport();

  if (isLoading || !transportOptions) {
    return <div className="p-4 border rounded-xl bg-card animate-pulse h-[300px]" />;
  }

  return (
    <div className="p-4 border border-border/50 bg-card rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Live Transport Status</h2>
        <span className="text-xs font-mono text-muted-foreground">AUTO-REFRESHING</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {transportOptions.map((transport) => {
          let Icon = Car;
          if (transport.type === "metro") Icon = Train;
          if (transport.type === "bus" || transport.type === "shuttle") Icon = Bus;

          const isDelayed = transport.status !== "on_time";

          return (
            <div
              key={transport.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/50"
              role="region"
              aria-label={`${transport.name} status`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-md shadow-sm">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{transport.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {transport.type} • Next: {new Date(transport.nextDeparture || "").toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isDelayed ? (
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    Delayed {transport.delayMinutes}m
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded-md text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    On Time
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
