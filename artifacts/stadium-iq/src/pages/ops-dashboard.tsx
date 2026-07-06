import { 
  useGetCrowdHeatmap, 
  useListGates, 
  useListIncidents, 
  useListAlerts, 
  useGetOperationalRecommendations 
} from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, ShieldAlert, Users, Zap, Map, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

export default function OpsDashboard() {
  const refreshOpts = { query: { refetchInterval: 30000 } }
  
  const { data: heatmap } = useGetCrowdHeatmap(refreshOpts)
  const { data: gates } = useListGates(refreshOpts)
  const { data: incidents } = useListIncidents(refreshOpts)
  const { data: alerts } = useListAlerts(refreshOpts)
  const { data: recommendations } = useGetOperationalRecommendations(refreshOpts)

  const criticalAlerts = alerts?.filter(a => a.level === 'critical' && !a.acknowledged) || []

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Operations Command</h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Live Sector Feed</p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-lg border border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground uppercase">Data Sync Active</span>
          </div>
        </div>
      </div>

      {criticalAlerts.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-red-500 uppercase tracking-wider text-sm">Critical Active Alerts ({criticalAlerts.length})</h3>
            <div className="flex flex-col gap-2 mt-2">
              {criticalAlerts.map(alert => (
                <div key={alert.id} className="flex items-center gap-3 text-sm">
                  <Badge variant="critical" className="rounded-sm px-1.5 py-0 text-[10px]">{alert.zone || 'GLOBAL'}</Badge>
                  <span className="font-medium">{alert.title}</span>
                  <span className="text-muted-foreground">- {alert.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column - Realtime Map & Gates */}
        <div className="xl:col-span-3 space-y-6">
          
          <Card className="border-border/50 shadow-md">
            <CardHeader className="border-b border-border/30 bg-secondary/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-primary" />
                  <CardTitle>Sector Heatmap</CardTitle>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-md flex flex-col">
              <CardHeader className="border-b border-border/30 bg-secondary/10 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  <CardTitle>Active Incidents</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader className="bg-muted/50 sticky top-0">
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incidents?.filter(i => i.status !== 'resolved').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            No active incidents.
                          </TableCell>
                        </TableRow>
                      )}
                      {incidents?.filter(i => i.status !== 'resolved').map(incident => (
                        <TableRow key={incident.id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold text-sm capitalize">{incident.type.replace('_', ' ')}</span>
                              <Badge variant={
                                incident.severity === 'critical' ? 'critical' :
                                incident.severity === 'high' ? 'warning' : 'secondary'
                              } className="w-fit text-[10px] px-1.5 py-0">
                                {incident.severity}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-mono text-xs">{incident.location}</span>
                              <span className="text-xs text-muted-foreground line-clamp-1" title={incident.description}>
                                {incident.description}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] uppercase">
                              {incident.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-md flex flex-col">
              <CardHeader className="border-b border-border/30 bg-secondary/10 pb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle>Gate Congestion</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader className="bg-muted/50 sticky top-0">
                      <TableRow>
                        <TableHead>Gate</TableHead>
                        <TableHead>Queue</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gates?.sort((a,b) => b.queueLengthMinutes - a.queueLengthMinutes).map(gate => (
                        <TableRow key={gate.id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-bold">{gate.name}</span>
                              <span className="text-xs text-muted-foreground font-mono">Sec {gate.sector}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold">{gate.queueLengthMinutes}m</span>
                              <Progress 
                                value={gate.densityPercent} 
                                className="w-16 h-1.5 hidden sm:block" 
                                indicatorColor={gate.densityPercent > 80 ? "bg-red-500" : gate.densityPercent > 60 ? "bg-amber-500" : "bg-green-500"}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              gate.status === 'open' ? 'success' :
                              gate.status === 'congested' ? 'warning' : 'critical'
                            } className="text-[10px]">
                              {gate.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Right Column - AI Recommendations */}
        <div className="xl:col-span-1">
          <Card className="h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-primary">
                <Zap className="w-5 h-5" />
                <CardTitle>AI Insights</CardTitle>
              </div>
              <CardDescription>Auto-generated operational directives</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-280px)] px-6 pb-6">
                <div className="space-y-4 pr-3">
                  {recommendations?.map(rec => (
                    <div key={rec.id} className="p-4 rounded-lg border border-border bg-card/80 backdrop-blur shadow-sm space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground uppercase">
                          <Lightbulb className="w-3 h-3 text-amber-500" />
                          {rec.category.replace('_', ' ')}
                        </div>
                        <Badge variant={
                          rec.priority === 'critical' ? 'critical' :
                          rec.priority === 'high' ? 'warning' : 'secondary'
                        } className="text-[9px] px-1 py-0">
                          {rec.priority}
                        </Badge>
                      </div>
                      
                      <h4 className="font-bold text-sm leading-tight">{rec.title}</h4>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rec.recommendation}
                      </p>

                      {rec.affectedZones.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                          {rec.affectedZones.map(z => (
                            <span key={z} className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-[10px] font-mono">
                              {z}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {recommendations?.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground flex flex-col items-center gap-2">
                      <ShieldAlert className="w-8 h-8 opacity-20" />
                      <p className="text-sm">Operations normal. No urgent recommendations.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
