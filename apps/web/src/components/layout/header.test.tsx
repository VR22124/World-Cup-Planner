/** @vitest-environment jsdom */
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the API hooks
vi.mock("@workspace/api-client-react", () => ({
  useGetStadiumStatus: () => ({
    data: {
      matchStatus: { homeTeam: "Brazil", awayTeam: "France", homeScore: 2, awayScore: 1, minute: 45, phase: "half_time" },
      overallCrowdLevel: "high",
      weather: { temperatureCelsius: 24, windKph: 12, humidity: 60 },
      totalAttendance: 82500,
      capacityPercent: 95
    },
    isLoading: false,
  }),
}));

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton" />
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: unknown[]) => args.join(" ")
}));

// Mock Link from wouter
vi.mock("wouter", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useLocation: () => ["/", vi.fn()],
}));

describe("Header Component", () => {
  it("renders stadium status correctly", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );

    expect(screen.getByText("Brazil")).toBeDefined();
    expect(screen.getByText("2 - 1")).toBeDefined();
    expect(screen.getByText("France")).toBeDefined();
  });
});
