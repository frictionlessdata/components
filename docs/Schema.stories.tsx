import '../src/styles'
import React from 'react'
import { Story, Meta } from '@storybook/react'
import { Schema, ISchemaProps } from '../src'

export default {
  title: 'Components/Schema',
  component: Schema,
} as Meta

const Template: Story<ISchemaProps> = (args) => <Schema {...args} />
const onSave = () => alert('Clicked on the "Save button"')

export const Empty = Template.bind({})
Empty.args = {
  onSave,
}

export const Source = Template.bind({})
Source.args = {
  source:
    'https://raw.githubusercontent.com/frictionlessdata/frictionless-py/main/data/table.csv',
  onSave,
}
