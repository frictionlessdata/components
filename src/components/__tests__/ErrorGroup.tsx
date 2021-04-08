import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { getTableErrorGroups } from '../../helpers'
import { ErrorGroup } from '../ErrorGroup'
import report from './fixtures/report.json'

// Tests

it('should render', () => {
  render(<ErrorGroup errorGroup={getTableErrorGroups(report.tables[0])['blank-header']} />)
  expect(screen.getByRole('button')).toHaveTextContent('Blank Header')
})
