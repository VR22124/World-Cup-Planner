import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Zap, Lightbulb, RefreshCw, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

export function AiInsights({ 
  recommendations, 
  refetchRecommendations, 
  isFetchingRecommendations 
}: { 
  recommendations: any[], 
  refetchRecommendations: () => void, 
  isFetchingRecommendations: boolean 
}) {
  return (
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
                <div key={rec.id} tabIndex={0} className="p-4 rounded-lg border border-border bg-card/80 backdrop-blur shadow-sm space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all" role="article" aria-live="polite">
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

                  {rec.affectedZones?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                      {rec.affectedZones.map((z: string) => (
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
  )
}
