import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { ReportDemo } from '../../src/components/ReportDemo'

// Tests

it('should render', () => {
  render(<ReportDemo />)
  expect(screen.getByText('ReportDemo')).toBeVisible()
})
