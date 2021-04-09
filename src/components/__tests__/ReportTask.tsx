import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import report from './fixtures/report.json'
import { ReportTask } from '../ReportTask'

// Tests

it('should render', () => {
  render(<ReportTask task={report.tables[0]} taskNumber={1} tasksCount={2} />)
  expect(screen.getByText('invalid.csv')).toBeVisible()
})
