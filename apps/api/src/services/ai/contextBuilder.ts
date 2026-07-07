import {
  getStadiumStatus,
  getGates,
  getCrowdHeatmap,
  getTransport,
  getIncidents,
  getAlerts,
} from "../stadiumSimulator.js";

export function buildStadiumContext(): string {
  const status = getStadiumStatus();
  const gates = getGates();
  const crowd = getCrowdHeatmap();
  const transport = getTransport();
  const incidents = getIncidents().filter((i) => i.status !== "resolved");
  const alerts = getAlerts().filter((a) => !a.acknowledged);

  const formatList = (items: string[]): string =>
    items.length > 0 ? items.join(", ") : "None";

  const closedGates = gates
    .filter((g) => g.status === "closed")
    .map((g) => `${g.name} (CLOSED - ${g.densityPercent}% capacity)`);

  const congestedGates = gates
    .filter((g) => g.status === "congested")
    .map((g) => `${g.name} (${g.densityPercent}% capacity, ${g.queueLengthMinutes}min queue)`);

  const criticalZones = crowd
    .filter((z) => z.level === "critical" || z.level === "high")
    .map((z) => `${z.zoneName} (${z.densityPercent}%)`);

  const transportIssues = transport
    .filter((t) => t.status !== "on_time")
    .map((t) => `${t.name}: ${t.status} (+${t.delayMinutes}min)`);

  const highSeverityIncidents = incidents.filter(
    (i) => i.severity === "critical" || i.severity === "high",
  );
  const criticalAlerts = alerts.filter((a) => a.level === "critical");

  return [
    `STADIUM: MetLife Stadium, New York — FIFA World Cup 2026`,
    `MATCH: ${status.matchStatus.homeTeam} ${status.matchStatus.homeScore}-${status.matchStatus.awayScore} ${status.matchStatus.awayTeam} | Minute ${status.matchStatus.minute} | Phase: ${status.matchStatus.phase}`,
    `ATTENDANCE: ${status.totalAttendance.toLocaleString()} (${status.capacityPercent}% capacity) | Overall crowd: ${status.overallCrowdLevel.toUpperCase()}`,
    `WEATHER: ${status.weather.condition}, ${status.weather.temperatureCelsius}°C, Humidity ${status.weather.humidity}%, Wind ${status.weather.windKph}km/h, UV ${status.weather.uvIndex}`,
    `CLOSED GATES: ${formatList(closedGates)}`,
    `CONGESTED GATES: ${formatList(congestedGates)}`,
    `HIGH DENSITY ZONES: ${formatList(criticalZones)}`,
    `TRANSPORT ISSUES: ${formatList(transportIssues)}`,
    `ACTIVE INCIDENTS: ${incidents.length} (${highSeverityIncidents.length} high+)`,
    `ACTIVE ALERTS: ${alerts.length} (${criticalAlerts.length} critical)`,
  ].join("\n");
}
