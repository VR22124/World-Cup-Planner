import { useListVolunteers, useListIncidents } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { AiChatWidget } from "@/components/chat/ai-chat-widget"
import { Users, Search, ShieldAlert, CheckCircle2, MessageSquare } from "lucide-react"
import { useState } from "react"

export default function VolunteerHub() {
  const { data: volunteers } = useListVolunteers()
  const { data: incidents } = useListIncidents()
  
  const [search, setSearch] = useState("")
  
  const filteredVolunteers = volunteers?.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.zone.toLowerCase().includes(search.toLowerCase()) ||
    v.role.toLowerCase().includes(search.toLowerCase())
  ) || []

  const assignedIncidents = incidents?.filter(i => i.volunteersAssigned > 0 && i.status !== 'resolved') || []

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Volunteer Hub</h1>
        <p className="text-muted-foreground">Manage deployments and communicate with ground staff.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Roster */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-md">
            <CardHeader className="border-b border-border/30 bg-secondary/10 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <CardTitle>Active Roster</CardTitle>
                  <Badge variant="outline" className="ml-2 font-mono">
                    {volunteers?.filter(v => v.status !== 'off_duty').length || 0} ON DUTY
                  </Badge>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search name, zone, role..." 
                    className="pl-9 h-9 bg-background"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Role & Zone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current Task</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVolunteers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No volunteers found matching search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVolunteers.map(vol => (
                        <TableRow key={vol.id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-bold">{vol.name}</span>
                              <div className="flex flex-wrap gap-1">
                                {vol.languages.map(l => (
                                  <span key={l} className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded uppercase font-mono">
                                    {l}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 items-start">
                              <Badge variant="outline" className="capitalize text-xs">
                                {vol.role.replace('_', ' ')}
                              </Badge>
                              <span className="text-xs font-mono text-muted-foreground">{vol.zone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              vol.status === 'available' ? 'success' :
                              vol.status === 'assigned' ? 'warning' :
                              vol.status === 'on_break' ? 'info' : 'secondary'
                            } className="text-[10px] uppercase">
                              {vol.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <span className="text-sm text-muted-foreground truncate block" title={vol.currentTask || 'Unassigned'}>
                              {vol.currentTask || '-'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-md">
            <CardHeader className="border-b border-border/30 bg-secondary/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <CardTitle className="text-base">Assigned Incidents</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3">
              {assignedIncidents.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-green-500/50" />
                  <p className="text-sm">No active incidents require volunteer deployment.</p>
                </div>
              ) : (
                assignedIncidents.map(inc => (
                  <div key={inc.id} className="p-3 bg-secondary/20 rounded border border-border/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-[10px]">{inc.location}</Badge>
                      <span className="text-xs font-bold text-amber-500">{inc.volunteersAssigned} assigned</span>
                    </div>
                    <p className="text-sm font-medium leading-snug">{inc.description}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="h-[400px]">
            <Card className="h-full flex flex-col border-primary/20 shadow-md">
              <CardHeader className="border-b border-border/30 pb-3 bg-primary/5">
                <div className="flex items-center gap-2 text-primary">
                  <MessageSquare className="w-5 h-5" />
                  <CardTitle className="text-base">Command Assistant</CardTitle>
                </div>
                <CardDescription className="text-xs">Quick guidance for volunteer deployment</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <AiChatWidget persona="volunteer" />
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}
