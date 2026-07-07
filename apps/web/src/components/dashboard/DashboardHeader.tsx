import React from "react";
export function DashboardHeader() {
  return (
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
  )
}
