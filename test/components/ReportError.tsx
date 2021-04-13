import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { getReportErrors } from '../../src/components/ReportTask'
import { ReportError } from '../../src/components/ReportError'
import report from '../../data/report-invalid.json'

// Tests

it('should render', () => {
  render(<ReportError reportError={getReportErrors(report.tasks[0])['blank-label']} />)
  expect(screen.getByRole('button')).toHaveTextContent('Blank Label')
})
