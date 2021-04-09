import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { getTaskErrorGroups } from '../../helpers'
import { ErrorGroup } from '../ErrorGroup'
import report from './fixtures/report.json'

// Tests

it('should render', () => {
  render(<ErrorGroup errorGroup={getTaskErrorGroups(report.tables[0])['blank-header']} />)
  expect(screen.getByRole('button')).toHaveTextContent('Blank Header')
})
