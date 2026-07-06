import { 
  useGetCrowdHeatmap, 
  useListGates, 
  useListIncidents, 
  useListAlerts, 
  useGetOperationalRecommendations,
  useGenerateAnnouncement
} from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, ShieldAlert, Users, Zap, Map, Lightbulb, RefreshCw, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React, { useState } from "react"

export default function OpsDashboard() {
  const { data: heatmap } = useGetCrowdHeatmap()
  const { data: gates } = useListGates()
  const { data: incidents } = useListIncidents()
  const { data: alerts } = useListAlerts()
  const { data: recommendations, refetch: refetchRecommendations, isFetching: isFetchingRecommendations } = useGetOperationalRecommendations()

  const criticalAlerts = alerts?.filter(a => a.level === 'critical' && !a.acknowledged) || []

  return (
    <main className="p-6 max-w-[1600px] mx-auto space-y-6" aria-label="Operations Dashboard">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">World Cup 2026 MetLife Command Center</h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Operations Management & Fan Experience</p>
          <p className="text-muted-foreground text-xs max-w-3xl mt-1 opacity-80">
            A GenAI-enabled solution that enhances stadium operations and the overall tournament experience for fans, organizers, volunteers, and venue staff. Leveraging Generative AI to improve navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, and real-time decision support during the FIFA World Cup 2026.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-lg border border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground uppercase">Data Sync Active</span>
          </div>
        </div>
      </div>

      {criticalAlerts.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-4" role="alert" aria-live="assertive">
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section aria-labelledby="incidents-title">
              <Card className="border-border/50 shadow-md flex flex-col">
                <CardHeader className="border-b border-border/30 bg-secondary/10 pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-primary" aria-hidden="true" />
                    <CardTitle id="incidents-title">Active Incidents</CardTitle>
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
                          <TableCell>
                            <AnnouncementDialog incident={incident} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
            </section>

            <section aria-labelledby="gates-title">
              <Card className="border-border/50 shadow-md flex flex-col">
                <CardHeader className="border-b border-border/30 bg-secondary/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" aria-hidden="true" />
                    <CardTitle id="gates-title">Gate Congestion</CardTitle>
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
            </section>
          </div>

        </div>

        {/* Right Column - AI Recommendations */}
        <div className="xl:col-span-1">
          <section aria-labelledby="ai-insights-title" className="h-full">
            <Card className="h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary">
                    <Zap className="w-5 h-5" aria-hidden="true" />
                    <CardTitle id="ai-insights-title">AI Insights</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetchRecommendations()} 
                  disabled={isFetchingRecommendations}
                  className="h-8 px-2 text-xs"
                  aria-label="Refresh AI Recommendations"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isFetchingRecommendations && "animate-spin")} aria-hidden="true" />
                  Refresh
                </Button>
              </div>
              <CardDescription>Auto-generated operational directives</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-280px)] px-6 pb-6">
                <div className="space-y-4 pr-3">
                  {isFetchingRecommendations ? (
                    <div className="space-y-4 pt-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 rounded-lg border border-border bg-card/50 animate-pulse space-y-3">
                          <div className="h-4 bg-muted rounded w-1/3"></div>
                          <div className="h-3 bg-muted rounded w-full mt-2"></div>
                          <div className="h-3 bg-muted rounded w-4/5"></div>
                        </div>
                      ))}
                    </div>
                  ) : recommendations?.map(rec => (
                    <div key={rec.id} className="p-4 rounded-lg border border-border bg-card/80 backdrop-blur shadow-sm space-y-3" role="article" aria-live="polite">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground uppercase">
                          <Lightbulb className="w-3 h-3 text-amber-500" aria-hidden="true" />
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
                  
                  {!isFetchingRecommendations && recommendations?.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground flex flex-col items-center gap-2">
                      <ShieldAlert className="w-8 h-8 opacity-20" aria-hidden="true" />
                      <p className="text-sm">Operations normal. No urgent recommendations.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          </section>
        </div>

      </div>
    </main>
  )
}

function AnnouncementDialog({ incident }: { incident: any }) {
  const { mutateAsync: generate, isPending } = useGenerateAnnouncement()
  const [announcement, setAnnouncement] = useState<any>(null)

  const handleGenerate = async () => {
    try {
      const result = await generate({
        data: {
          incidentId: incident.id,
          incidentDescription: incident.description,
          severity: incident.severity,
          zone: incident.location,
        }
      })
      setAnnouncement(result)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" aria-label="Generate PA Announcement">
          <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Multilingual PA Announcement</DialogTitle>
          <DialogDescription>
            AI-generated safety broadcast for incident: {incident.type.replace('_', ' ')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          {!announcement ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Generate a calm, clear, and localized broadcast message in English, Spanish, French, and Portuguese.
              </p>
              <Button onClick={handleGenerate} disabled={isPending}>
                {isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Generate Broadcast
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(announcement).map(([lang, text]) => (
                <div key={lang} className="space-y-1">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">{lang}</h4>
                  <p className="text-sm border-l-2 border-primary pl-3 py-1">{text as string}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" onClick={handleGenerate} disabled={isPending}>
                {isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Regenerate
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
