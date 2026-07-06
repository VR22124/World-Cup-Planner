import { useListTransport } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrainFront, Bus, Car, Navigation, AlertTriangle, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const IconMap: Record<string, React.ElementType> = {
  metro: TrainFront,
  bus: Bus,
  shuttle: Bus,
  taxi: Car,
  walking: Navigation
}

export default function Transport() {
  const { data: routes } = useListTransport({ query: { refetchInterval: 30000 } })

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Transport Network</h1>
        <p className="text-muted-foreground">Live departures, delays, and crowd control for all transit hubs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {routes?.map(route => {
          const Icon = IconMap[route.type] || Navigation

          return (
            <Card key={route.id} className={cn(
              "border-border/50 shadow-md overflow-hidden relative transition-all",
              route.status === 'suspended' ? "opacity-75 grayscale bg-muted/50" : "",
              route.status === 'disrupted' ? "border-red-500/30 bg-red-500/5" : ""
            )}>
              {route.status === 'suspended' && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-1 font-bold">SUSPENDED</Badge>
                </div>
              )}
              
              <CardHeader className="pb-4 border-b border-border/30 bg-secondary/10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      route.type === 'metro' ? "bg-blue-500/20 text-blue-500" :
                      route.type === 'bus' ? "bg-green-500/20 text-green-500" :
                      route.type === 'shuttle' ? "bg-purple-500/20 text-purple-500" :
                      "bg-primary/20 text-primary"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{route.name}</CardTitle>
                      <CardDescription className="text-xs uppercase tracking-wider font-mono">
                        {route.type}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={
                    route.status === 'on_time' ? 'success' :
                    route.status === 'delayed' ? 'warning' : 'critical'
                  } className="uppercase text-[10px]">
                    {route.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-5 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Destination</span>
                    <span className="font-bold">{route.destination}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-xs text-muted-foreground uppercase font-mono tracking-wider">Next</span>
                    <span className="font-mono text-xl font-black text-primary tracking-tighter">{route.nextDeparture}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-md bg-background border border-border/50">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase font-mono">
                      <Users className="w-3.5 h-3.5" />
                      Crowd Level
                    </div>
                    <Badge variant={
                      route.crowdLevel === 'low' ? 'success' :
                      route.crowdLevel === 'moderate' ? 'warning' : 'critical'
                    } className="w-fit text-[10px] uppercase">
                      {route.crowdLevel}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      Delay
                    </div>
                    <span className={cn(
                      "font-mono font-bold text-sm",
                      route.delayMinutes > 0 ? "text-amber-500 flex items-center gap-1" : "text-green-500"
                    )}>
                      {route.delayMinutes > 0 ? (
                        <>+{route.delayMinutes}m <AlertTriangle className="w-3 h-3" /></>
                      ) : (
                        "On Time"
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
