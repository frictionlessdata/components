import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { ReportTask } from '../../src/components/ReportTask'
import report from '../../data/report-invalid.json'

// Tests

it('should render', () => {
  render(<ReportTask task={report.tasks[0]} taskNumber={1} tasksCount={1} />)
  expect(screen.getByText('invalid.csv')).toBeVisible()
})
