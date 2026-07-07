/** @vitest-environment jsdom */
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
afterEach(cleanup);


import React from "react";
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeatmapSection } from '../HeatmapSection'

describe('HeatmapSection', () => {
  it('renders heatmap zones correctly', () => {
    const mockHeatmap = [
      { zoneId: 'A1', zoneName: 'North Gate A', densityPercent: 85, current: 850, capacity: 1000, level: 'critical' },
      { zoneId: 'B1', zoneName: 'South Gate B', densityPercent: 40, current: 400, capacity: 1000, level: 'moderate' },
    ]
    render(<HeatmapSection heatmap={mockHeatmap} />)
    
    expect(screen.getByText('Sector Heatmap')).toBeDefined()
    expect(screen.getByText('A1')).toBeDefined()
    expect(screen.getByText('North Gate A')).toBeDefined()
    expect(screen.getByText('85%')).toBeDefined()
    
    expect(screen.getByText('B1')).toBeDefined()
    expect(screen.getByText('South Gate B')).toBeDefined()
    expect(screen.getByText('40%')).toBeDefined()
  })
})
