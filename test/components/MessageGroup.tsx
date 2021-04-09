import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { MessageGroup } from '../../src/components/MessageGroup'

// Tests

it('should render', () => {
  render(<MessageGroup type={'warning'} title={'title'} messages={['message']} />)
  expect(screen.getByText('title')).toBeVisible()
  expect(screen.getByText('message')).toBeVisible()
})
