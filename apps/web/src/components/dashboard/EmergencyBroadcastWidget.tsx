import { AlertTriangle, Globe, Megaphone } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export function EmergencyBroadcastWidget() {
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcasted, setBroadcasted] = useState(false);

  const handleBroadcast = () => {
    setBroadcasting(true);
    // Simulate AI Translation & Broadcast to stadium systems
    setTimeout(() => {
      setBroadcasting(false);
      setBroadcasted(true);
    }, 1500);
  };

  return (
    <Card className="border-red-900/50 bg-red-950/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-red-500 flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            AI Multi-Lingual Broadcast
          </CardTitle>
          <Globe className="h-4 w-4 text-red-500/70" />
        </div>
        <CardDescription>
          Translate & push alerts to stadium PA and mobile apps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-background/50 p-3 rounded-md border border-border/50 text-sm">
            <strong>Active High-Priority Alert:</strong> Sector 4 Medical Emergency. Medical teams dispatched. Please clear aisle 4B.
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>Target Languages:</span>
              <span className="font-mono">EN, ES, FR, AR</span>
            </div>
            <Button 
              variant={broadcasted ? "outline" : "destructive"} 
              className="w-full"
              onClick={handleBroadcast}
              disabled={broadcasting || broadcasted}
            >
              {broadcasting ? (
                "AI Translating & Broadcasting..."
              ) : broadcasted ? (
                "Broadcast Active in 4 Languages"
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Initiate Global Broadcast
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
