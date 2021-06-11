import React from 'react'
import { IDict } from '../common'
import * as helpers from '../helpers'

export interface ISchemaPreviewProps {
  columns: IDict[]
  metadata: IDict
}

export function SchemaPreview(props: ISchemaPreviewProps) {
  const schema = helpers.exportSchema(props.columns, props.metadata)
  const schemaAsText = JSON.stringify(schema, null, 2)

  // Render
  return (
    <div className="tableschema-ui-editor-preview">
      <pre>
        <code>{schemaAsText}</code>
      </pre>
    </div>
  )
}
