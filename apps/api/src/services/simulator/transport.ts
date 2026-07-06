import { timeSeed, varyInRange, crowdLevel, type TransportStatus } from "./core.js";

export function getTransport() {
  const seed = timeSeed();
  const routes = [
    {
      id: "T1",
      type: "metro" as const,
      name: "Metro Line A — Stadium Direct",
      dest: "Downtown Hub",
      base: "on_time" as const,
      baseDelay: 0,
    },
    {
      id: "T2",
      type: "metro" as const,
      name: "Metro Line B — East Connection",
      dest: "East Terminal",
      base: "delayed" as const,
      baseDelay: 8,
    },
    {
      id: "T3",
      type: "bus" as const,
      name: "Bus Route 42 — North Park & Ride",
      dest: "North Parking",
      base: "on_time" as const,
      baseDelay: 0,
    },
    {
      id: "T4",
      type: "bus" as const,
      name: "Bus Route 55 — South Zone",
      dest: "South Hub",
      base: "delayed" as const,
      baseDelay: 15,
    },
    {
      id: "T5",
      type: "shuttle" as const,
      name: "Shuttle A — Hotel District",
      dest: "Marriott Cluster",
      base: "on_time" as const,
      baseDelay: 0,
    },
    {
      id: "T6",
      type: "shuttle" as const,
      name: "Shuttle B — Airport Express",
      dest: "JFK Terminal 4",
      base: "disrupted" as const,
      baseDelay: 35,
    },
    {
      id: "T7",
      type: "taxi" as const,
      name: "Official Taxi Zone",
      dest: "Drop-off Zone C",
      base: "on_time" as const,
      baseDelay: 0,
    },
    {
      id: "T8",
      type: "walking" as const,
      name: "Fan Walk — North Pedestrian",
      dest: "North Gate Plaza",
      base: "on_time" as const,
      baseDelay: 0,
    },
  ];

  return routes.map((r, i) => {
    const delay =
      r.baseDelay > 0
        ? varyInRange(
            r.baseDelay,
            Math.max(0, r.baseDelay - 5),
            r.baseDelay + 10,
            seed,
            i * 13,
          )
        : 0;
    const status: TransportStatus =
      delay === 0 ? "on_time" : delay > 30 ? "disrupted" : "delayed";
    const nextMins = varyInRange(8, 3, 20, seed, i * 14);
    const nextDep = new Date(Date.now() + nextMins * 60000);
    return {
      id: r.id,
      type: r.type,
      name: r.name,
      status,
      delayMinutes: delay,
      nextDeparture: nextDep.toISOString(),
      destination: r.dest,
      crowdLevel: crowdLevel(varyInRange(60, 30, 95, seed, i * 15)) as
        | "low"
        | "moderate"
        | "high",
    };
  });
}
