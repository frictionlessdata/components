import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Report, IReportProps } from '../src'
import reportInvalid from '../data/report-invalid.json'
import reportValid from '../data/report-valid.json'

export default {
  title: 'Example/Report',
  component: Report,
} as Meta

const Template: Story<IReportProps> = (args) => <Report {...args} />

export const Invalid = Template.bind({})
Invalid.args = {
  report: reportInvalid,
}

export const Valid = Template.bind({})
Valid.args = {
  report: reportValid,
}
