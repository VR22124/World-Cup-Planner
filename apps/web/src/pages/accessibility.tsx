import { useGetAccessibilityInfo } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PersonStanding, Accessibility as AccessibilityIcon, Ear, Eye, Users, AlertOctagon, Info } from "lucide-react"

export default function Accessibility() {
  const { data: info } = useGetAccessibilityInfo()

  if (!info) return null

  return (
    <div className="p-6 max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
          <PersonStanding className="w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Accessibility Center</h1>
          <p className="text-muted-foreground">Resources and specialized services for fans.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Services */}
        <Card className="md:col-span-2 border-blue-500/20 bg-blue-500/5 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-blue-500">Available Services Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-background border border-border flex items-center gap-4">
                <Ear className="w-8 h-8 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Sign Language</span>
                  <Badge variant={info.signLanguageServices ? 'success' : 'secondary'} className="w-fit mt-1 text-[10px]">
                    {info.signLanguageServices ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background border border-border flex items-center gap-4">
                <Eye className="w-8 h-8 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Audio Description</span>
                  <Badge variant={info.audioDescriptionAvailable ? 'success' : 'secondary'} className="w-fit mt-1 text-[10px]">
                    {info.audioDescriptionAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background border border-border flex items-center gap-4">
                <AccessibilityIcon className="w-8 h-8 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Mobility Aid Rental</span>
                  <Badge variant={info.mobilityAidRental ? 'success' : 'secondary'} className="w-fit mt-1 text-[10px]">
                    {info.mobilityAidRental ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-blue-500">Dedicated Support Volunteers</span>
              </div>
              <span className="text-2xl font-black font-mono text-blue-500">{info.dedicatedVolunteers}</span>
            </div>
          </CardContent>
        </Card>

        {/* Locations */}
        <Card className="border-border/50">
          <CardHeader className="pb-3 border-b border-border/30 bg-secondary/10">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Facility Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              <div className="p-4 flex flex-col gap-3">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-mono">Accessible Entrances</span>
                <div className="flex flex-wrap gap-2">
                  {info.wheelchairEntrances.map(gate => (
                    <Badge key={gate} variant="outline" className="font-mono">{gate}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-mono">Accessible Restrooms</span>
                <div className="flex flex-wrap gap-2">
                  {info.accessibleRestrooms.map(room => (
                    <Badge key={room} variant="outline" className="font-mono bg-secondary/50">{room}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evacuation */}
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader className="pb-3 border-b border-red-500/10">
            <CardTitle className="text-base flex items-center gap-2 text-red-500">
              <AlertOctagon className="w-4 h-4" />
              Emergency Evacuation
            </CardTitle>
            <CardDescription className="text-red-500/80">Priority assisted exit points</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {info.emergencyEvacuationPoints.map(point => (
                <div key={point} className="p-3 bg-background border border-red-500/20 rounded flex items-center justify-center">
                  <span className="font-mono font-bold text-red-500">{point}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
