import '../src/styles'
import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Schema, ISchemaProps } from '../src'

export default {
  title: 'Components/Schema',
  component: Schema,
} as Meta

const Template: Story<ISchemaProps> = (args) => <Schema {...args} />

export const Default = Template.bind({})
Default.args = {
  onSave: () => alert('Clicked on the "Save button"'),
}
