import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { getTaskReportErrors } from '../../src/helpers'
import { ReportError } from '../../src/components/ReportError'
import report from '../../data/report-test.json'

// Tests

it('should render', () => {
  render(<ReportError reportError={getTaskReportErrors(report.tables[0])['blank-header']} />)
  expect(screen.getByRole('button')).toHaveTextContent('Blank Header')
})
