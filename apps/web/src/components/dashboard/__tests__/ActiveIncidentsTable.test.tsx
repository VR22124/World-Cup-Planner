/** @vitest-environment jsdom */
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
afterEach(cleanup);


import React from "react";
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ActiveIncidentsTable } from '../ActiveIncidentsTable'

vi.mock('@workspace/api-client-react', () => ({
  useGenerateAnnouncement: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })
}))

describe('ActiveIncidentsTable', () => {
  it('renders "No active incidents" when empty', () => {
    render(<ActiveIncidentsTable incidents={[]} />)
    expect(screen.getByText('No active incidents.')).toBeDefined()
  })

  it('renders incident rows with correct accessibility', () => {
    const mockIncidents = [
      { id: '1', type: 'MEDICAL', severity: 'critical', location: 'Section 120', status: 'investigating', description: 'Medical emergency' },
    ]
    render(<ActiveIncidentsTable incidents={mockIncidents} />)
    
    expect(screen.getByRole('table', { name: 'Active Incidents Table' })).toBeDefined()
    expect(screen.getByText('MEDICAL')).toBeDefined()
    expect(screen.getByText('Section 120')).toBeDefined()
    expect(screen.getByText('Medical emergency')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Generate PA Announcement' })).toBeDefined()
  })
})
