import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import report from './fixtures/report.json'
import { Table } from '../Table'

// Tests

it('should render', () => {
  render(<Table table={report.tables[0]} tableNumber={1} tablesCount={2} />)
  expect(screen.getByText('invalid.csv')).toBeVisible()
})
