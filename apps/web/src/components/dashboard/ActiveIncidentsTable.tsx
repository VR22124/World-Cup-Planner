import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShieldAlert, Volume2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React, { useState } from "react"
import { useGenerateAnnouncement } from "@workspace/api-client-react"

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

export function ActiveIncidentsTable({ incidents }: { incidents: any[] }) {
  const activeIncidents = incidents?.filter(i => i.status !== 'resolved') || []

  return (
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
            <Table aria-label="Active Incidents Table">
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeIncidents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No active incidents.
                    </TableCell>
                  </TableRow>
                )}
                {activeIncidents.map(incident => (
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
  )
}
