/** @vitest-environment jsdom */
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import OpsDashboard from "./ops-dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock API hooks
vi.mock("@workspace/api-client-react", () => ({
  useGetCrowdHeatmap: () => ({ data: [] }),
  useListGates: () => ({ data: [] }),
  useListIncidents: () => ({ data: [] }),
  useListAlerts: () => ({ data: [] }),
  useListTransport: () => ({ data: [] }),
  useListVolunteers: () => ({ data: [] }),
  useGetSustainability: () => ({ data: { powerGridLoadPercent: 0, renewableEnergyUsagePercent: 0, wasteManagementCapacityPercent: 0, carbonOffsetTons: 0 } }),
  useGenerateAnnouncement: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useGetOperationalRecommendations: () => ({
    data: [],
    refetch: vi.fn(),
    isFetching: false
  })
}));

// Mock utils
vi.mock("@/lib/utils", () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(" ")
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("OpsDashboard Component", () => {
  it("renders correctly with mocked data", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <OpsDashboard />
      </QueryClientProvider>
    );

    // Verify main components are rendered
    expect(screen.getByText(/World Cup 2026 MetLife Command Center/i)).toBeDefined();
    expect(screen.getByText('Sector Heatmap')).toBeDefined();
    expect(screen.getByText('Active Incidents')).toBeDefined();
    expect(screen.getByText('Gate Congestion')).toBeDefined();
    expect(screen.getByText('AI Insights')).toBeDefined();
  });
});
