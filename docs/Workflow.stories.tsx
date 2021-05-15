import '../src/styles'
import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Workflow, IWorkflowProps } from '../src'

export default {
  title: 'Components/Workflow',
  component: Workflow,
} as Meta

const Template: Story<IWorkflowProps> = (args) => <Workflow {...args} />

export const Component = Template.bind({})
Component.args = {
  token: 'torkn',
}
