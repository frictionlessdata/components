import React from 'react'
import { IDict } from '../common'
import * as helpers from '../helpers'
import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'

export interface ISchemaPreviewProps {
  columns: IDict[]
  metadata: IDict
  setSchemaColumns: (columns: IDict<any>[], primaryKeys: string[]) => void
}

export function SchemaPreview(props: ISchemaPreviewProps) {
  const schema = helpers.exportSchema(props.columns, props.metadata)
  // const schemaAsText = JSON.stringify(schema, null, 2)
  const onBlur = (jsonSchema: IDict) => {
    if (!jsonSchema.error) {
      const jsObj = jsonSchema.jsObject
      props.setSchemaColumns(jsObj.fields, jsObj.primaryKey)
    }
  }
  return (
    <div>
      <JSONInput
        id="a_unique_id"
        placeholder={schema}
        theme="light_mitsuketa_tribute"
        locale={locale}
        onBlur={onBlur}
        height="550px"
        width="80%"
      />
    </div>
  )
}
