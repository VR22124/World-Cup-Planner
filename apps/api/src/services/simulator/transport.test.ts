import { describe, it, expect } from "vitest";
import { getTransport } from "./transport";

describe("Transport Simulator", () => {
  it("should return correct transport hubs", () => {
    const transport = getTransport();
    expect(transport).toHaveLength(8);
    expect(transport[0]).toHaveProperty("id", "T1");
    expect(transport[0]).toHaveProperty("name", "Metro Line A — Stadium Direct");
    expect(transport[0]).toHaveProperty("status");
  });
});

