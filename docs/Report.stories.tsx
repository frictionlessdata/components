import '../src/styles'
import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Report, IReportProps } from '../src'
import reportInvalid from '../data/report-invalid.json'
import reportInvalidV5 from '../data/report-invalid-v5.json'
import reportValid from '../data/report-valid.json'
import reportValidV5 from '../data/report-valid-v5.json'

export default {
  title: 'Components/Report',
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

export const InvalidV5 = Template.bind({})
InvalidV5.args = {
  report: reportInvalidV5,
}

export const ValidV5 = Template.bind({})
ValidV5.args = {
  report: reportValidV5,
}
