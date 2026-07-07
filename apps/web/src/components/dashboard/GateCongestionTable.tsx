import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users } from "lucide-react"

export function GateCongestionTable({ gates }: { gates: any[] }) {
  return (
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
            <Table aria-label="Gate Congestion Table">
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
  )
}
