import { timeSeed, varyInRange } from "./core";

export function getSustainabilityMetrics() {
  const seed = timeSeed();
  return {
    powerGridLoadPercent: varyInRange(75, 60, 95, seed, 20),
    renewableEnergyUsagePercent: varyInRange(40, 30, 60, seed, 21),
    carbonOffsetTons: varyInRange(12, 10, 15, seed, 22),
    wasteManagementCapacityPercent: varyInRange(50, 40, 85, seed, 23),
    waterUsageLiters: varyInRange(15000, 12000, 20000, seed, 24),
    updatedAt: new Date().toISOString(),
  };
}
