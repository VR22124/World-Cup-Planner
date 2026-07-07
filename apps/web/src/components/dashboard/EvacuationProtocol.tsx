import { ShieldAlert, Users, ArrowRightCircle } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export function EvacuationProtocol() {
  const [status, setStatus] = useState<"idle" | "arming" | "active">("idle");

  const handleTrigger = () => {
    if (status === "idle") setStatus("arming");
    else if (status === "arming") setStatus("active");
  };

  const handleCancel = () => {
    setStatus("idle");
  };

  return (
    <Card className={`border-2 ${status === 'active' ? 'border-red-600 animate-pulse bg-red-950/20' : 'border-orange-900/50 bg-orange-950/10'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-500">
            <ShieldAlert className="h-4 w-4" />
            Evacuation Protocol
          </CardTitle>
          <Users className="h-4 w-4 text-orange-500/70" />
        </div>
        <CardDescription>
          Automated crowd rerouting and gate control
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            AI has pre-computed safe exit vectors for all 85,000 attendees based on current heatmap data.
          </div>
          
          {status === "idle" && (
            <Button 
              variant="outline" 
              className="w-full border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
              onClick={handleTrigger}
            >
              Arm Evacuation System
            </Button>
          )}

          {status === "arming" && (
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                className="w-full flex-1 font-bold"
                onClick={handleTrigger}
              >
                <ArrowRightCircle className="mr-2 h-4 w-4" />
                EXECUTE
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}

          {status === "active" && (
            <div className="bg-red-500/20 text-red-500 p-3 rounded-md border border-red-500/50 text-center font-bold flex flex-col gap-1 text-sm">
              <span>PROTOCOL ACTIVE</span>
              <span className="text-xs font-normal">Gates open, turnstiles bypassed, PA alarming.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
