/** @vitest-environment jsdom */
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
afterEach(cleanup);


import React from "react";
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CriticalAlerts } from '../CriticalAlerts'

describe('CriticalAlerts', () => {
  it('renders nothing when there are no alerts', () => {
    const { container } = render(<CriticalAlerts alerts={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders critical alerts with proper accessibility attributes', () => {
    const mockAlerts = [
      { id: '1', level: 'critical', title: 'Fire Alarm', message: 'Evacuate sector A', zone: 'Sector A', acknowledged: false },
    ]
    render(<CriticalAlerts alerts={mockAlerts} />)
    
    const alertBanner = screen.getByRole('alert')
    expect(alertBanner).toBeDefined()
    expect(alertBanner.getAttribute('aria-live')).toBe('assertive')
    expect(screen.getByText('Critical Active Alerts (1)')).toBeDefined()
    expect(screen.getByText('Fire Alarm')).toBeDefined()
    expect(screen.getByText('- Evacuate sector A')).toBeDefined()
  })
})
