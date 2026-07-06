import { useGetStadiumStatus, useListGates, useListTransport } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AiChatWidget } from "@/components/chat/ai-chat-widget"
import { MapPin, Info, ArrowRight, Activity, Thermometer, Clock, Users } from "lucide-react"

export default function FanHub() {
  const { data: status } = useGetStadiumStatus({ query: { refetchInterval: 30000 } })
  const { data: gates } = useListGates({ query: { refetchInterval: 30000 } })
  const { data: transport } = useListTransport({ query: { refetchInterval: 30000 } })

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Fan Hub</h1>
        <p className="text-muted-foreground">Your intelligent guide to the FIFA 2026 experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stadium & Gates */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Stadium Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-black font-mono tracking-tighter">
                      {status?.capacityPercent ?? 0}%
                    </span>
                    <Badge variant={status?.overallCrowdLevel === 'high' ? 'warning' : status?.overallCrowdLevel === 'critical' ? 'critical' : 'success'} className="uppercase">
                      {status?.overallCrowdLevel || 'Loading'}
                    </Badge>
                  </div>
                  <Progress 
                    value={status?.capacityPercent ?? 0} 
                    indicatorColor={
                      (status?.capacityPercent ?? 0) > 90 ? "bg-red-500" :
                      (status?.capacityPercent ?? 0) > 75 ? "bg-amber-500" : "bg-primary"
                    }
                  />
                  <div className="text-sm text-muted-foreground flex justify-between">
                    <span>{status?.totalAttendance?.toLocaleString() ?? 0} fans</span>
                    <span>80,000 max</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-primary" />
                  Local Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex flex-col gap-4">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black font-mono tracking-tighter">
                      {status?.weather.temperatureCelsius ?? '--'}°
                    </span>
                    <span className="text-xl text-muted-foreground mb-1">{status?.weather.condition}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-muted-foreground">Humidity</span>
                      <span className="font-mono text-sm">{status?.weather.humidity ?? '--'}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-muted-foreground">Wind</span>
                      <span className="font-mono text-sm">{status?.weather.windKph ?? '--'} km/h</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-muted-foreground">UV Index</span>
                      <span className="font-mono text-sm">{status?.weather.uvIndex ?? '--'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Entrance Gates</CardTitle>
                <CardDescription>Live queue times and congestion</CardDescription>
              </div>
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {gates?.map(gate => (
                  <div key={gate.id} className="p-4 rounded-lg border border-border bg-secondary/20 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-lg">{gate.name}</h4>
                      <Badge variant={
                        gate.status === 'open' ? 'success' :
                        gate.status === 'congested' ? 'warning' : 'critical'
                      }>
                        {gate.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Queue</span>
                      <span className="font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {gate.queueLengthMinutes} min
                      </span>
                    </div>
                    <Progress value={gate.densityPercent} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Transport Overview</CardTitle>
                <CardDescription>Departures and delays</CardDescription>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-4">
                {transport?.filter(t => t.status !== 'suspended').slice(0, 4).map(route => (
                  <div key={route.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/10 border border-border/50">
                    <div className="flex flex-col">
                      <span className="font-semibold">{route.name}</span>
                      <span className="text-xs text-muted-foreground">To {route.destination}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {route.delayMinutes > 0 && (
                        <Badge variant="warning" className="text-[10px]">+{route.delayMinutes}m delay</Badge>
                      )}
                      <div className="text-right">
                        <div className="font-mono font-bold text-primary">{route.nextDeparture}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{route.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - AI Chat */}
        <div className="h-[600px] lg:h-auto">
          <AiChatWidget persona="fan" />
        </div>
      </div>
    </div>
  )
}
