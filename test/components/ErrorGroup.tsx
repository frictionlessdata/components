import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { getTaskErrorGroups } from '../../src/helpers'
import { ErrorGroup } from '../../src/components/ErrorGroup'
import * as report from '../../data/report-test.json'

// Tests

it('should render', () => {
  render(<ErrorGroup errorGroup={getTaskErrorGroups(report.tables[0])['blank-header']} />)
  expect(screen.getByRole('button')).toHaveTextContent('Blank Header')
})
