import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Report, IReportProps } from '../../src'
import report from '../../data/report.json'

export default {
  title: 'Example/Report',
  component: Report,
} as Meta

const Template: Story<IReportProps> = (args) => <Report {...args} />

export const Invalid = Template.bind({})
Invalid.args = {
  report,
}
