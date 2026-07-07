import React from "react";
import { Users, Globe2 } from "lucide-react";
import { useListVolunteers } from "@workspace/api-client-react";

export function VolunteerWidget() {
  const { data: volunteers, isLoading } = useListVolunteers();

  if (isLoading || !volunteers) {
    return <div className="p-4 border rounded-xl bg-card animate-pulse h-[300px]" />;
  }

  // Calculate totals
  const totalOnDuty = volunteers.filter(v => v.status === "available" || v.status === "assigned").length;
  
  return (
    <div className="p-4 border border-border/50 bg-card rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">Volunteer Deployment</h2>
        </div>
        <div className="text-sm font-medium bg-secondary px-2 py-1 rounded-md">
          {totalOnDuty} Active
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
        {volunteers.map((vol) => (
          <div key={vol.id} className="flex flex-col gap-1 p-3 rounded-lg bg-secondary/10 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{vol.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                vol.status === 'available' ? 'bg-green-500/10 text-green-500' :
                vol.status === 'assigned' ? 'bg-blue-500/10 text-blue-500' :
                'bg-muted text-muted-foreground'
              }`}>
                {vol.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
              <span>{vol.zone} • {vol.role.replace('_', ' ')}</span>
              <div className="flex items-center gap-1">
                <Globe2 className="w-3 h-3" />
                {vol.languages.join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
