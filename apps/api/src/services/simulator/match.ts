// @ts-nocheck
import { timeSeed, varyInRange, crowdLevel, type MatchPhase } from "./core";

function getMatchPhase(): MatchPhase {
  const minuteOfDay = new Date().getMinutes() + new Date().getHours() * 60;
  const phases: MatchPhase[] = [
    "pre_match",
    "first_half",
    "half_time",
    "second_half",
    "full_time",
  ];
  return phases[Math.floor(minuteOfDay / 30) % phases.length];
}

function getMatchMinute(phase: MatchPhase): number {
  switch (phase) {
    case "pre_match":
      return 0;
    case "first_half":
      return varyInRange(25, 1, 45, timeSeed(), 99);
    case "half_time":
      return 45;
    case "second_half":
      return varyInRange(70, 46, 90, timeSeed(), 98);
    case "extra_time":
      return varyInRange(100, 91, 120, timeSeed(), 97);
    case "full_time":
      return 90;
  }
}

export function getStadiumStatus() {
  const seed = timeSeed();
  const phase = getMatchPhase();
  const minute = getMatchMinute(phase);
  const capacityPercent = varyInRange(82, 65, 97, seed, 1);

  return {
    matchStatus: {
      homeTeam: "Brazil",
      awayTeam: "France",
      homeScore: 2,
      awayScore: 1,
      minute,
      phase,
      venue: "MetLife Stadium, New York",
    },
    weather: {
      condition: "Partly Cloudy",
      temperatureCelsius: varyInRange(24, 19, 31, seed, 2),
      humidity: varyInRange(62, 45, 80, seed, 3),
      windKph: varyInRange(12, 5, 28, seed, 4),
      uvIndex: varyInRange(6, 3, 9, seed, 5),
    },
    overallCrowdLevel: crowdLevel(capacityPercent),
    totalAttendance: Math.round((capacityPercent / 100) * 82500),
    capacityPercent,
    updatedAt: new Date().toISOString(),
  };
}
