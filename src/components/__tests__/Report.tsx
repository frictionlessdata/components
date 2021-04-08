import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import report from './fixtures/report.json'
import { Report } from '../Report'

// Tests

it('should render', () => {
  render(<Report report={report} />)
  expect(screen.getByText('Table 1 of 2')).toBeVisible()
  expect(screen.getByText('Table 2 of 2')).toBeVisible()
})
