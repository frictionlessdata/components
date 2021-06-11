import React, { useState } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { SchemaFeedback, ISchemaFeedbackProps } from './SchemaFeedback'
import { SchemaPreview } from './SchemaPreview'
import { SchemaField } from './SchemaField'
import * as helpers from '../helpers'
import { IDict } from '../common'

export interface ISchemaProps {
  source?: string | File
  schema: IDict | File
  onSave: any
  disablePreview: boolean
}

export function Schema(props: ISchemaProps) {
  const [error, setError] = useState(Error)
  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState([] as IDict[])
  const [metadata, setMetadata] = useState({} as IDict)
  const [feedback] = useState({} as ISchemaFeedbackProps['feedback'])

  // Mount
  useAsyncEffect(async () => {
    try {
      const { columns, metadata } = await helpers.importSchema(props.source, props.schema)
      setLoading(false)
      setColumns(columns)
      setMetadata(metadata)
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }, [])

  // Save
  const onSaveClick = () => {
    if (props.onSave) {
      const schema = helpers.exportSchema(columns, metadata)
      props.onSave(schema, error)
    }
  }

  // Feedback Reset
  const onFeedbackReset = () => {}

  // Add Field
  const onAddFieldClick = () => {}

  // Move Field End
  const onMoveFieldEnd = () => {}

  return (
    <div className="frictionless-components-schema">
      <div className="tableschema-ui-editor-schema">
        {/* Tab navigation */}
        <ul className="nav nav-pills navigation" role="tablist">
          {/* Title */}
          <li>
            <h2 className="title">Schema Editor</h2>
          </li>

          {/* Edit/Error */}
          <li className="nav-item active">
            <a
              className="nav-link button-edit"
              data-toggle="tab"
              href="#schema-editor-fields"
              role="tab"
              aria-controls="schema-editor-fields"
              aria-selected="true"
            >
              {!error ? (
                <span>{!props.disablePreview && <small>1. </small>}Edit</span>
              ) : (
                <span>Error</span>
              )}
            </a>
          </li>

          {/* Preview */}
          {!loading && !error && !props.disablePreview && (
            <li className="nav-item">
              <a
                className="nav-link button-preview"
                data-toggle="tab"
                href="#schema-editor-preview"
                role="tab"
                aria-controls="schema-editor-preview"
                aria-selected="false"
              >
                <small>2. </small>Preview
              </a>
            </li>
          )}

          {/* Save/Close */}
          {!loading && (
            <li className="nav-item">
              <a
                className="nav-link button-save"
                href="#"
                role="tab"
                aria-selected="false"
                onClick={(ev) => {
                  ev.preventDefault()
                  onSaveClick()
                }}
              >
                {!error ? (
                  <span>{!props.disablePreview && <small>3. </small>}Save</span>
                ) : (
                  <span>Close</span>
                )}
              </a>
            </li>
          )}
        </ul>

        <hr />

        {/* Feedback */}
        <SchemaFeedback feedback={feedback} onReset={onFeedbackReset} />

        {/* Tab contents */}
        {!loading && !error && (
          <div className="tab-content content">
            {/* Edit */}
            <div
              className="tab-pane active"
              id="schema-editor-fields"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <div className="form-group fields">
                {/* List fields */}
                <SortableFields
                  columns={columns}
                  metadata={metadata}
                  helperClass="tableschema-ui-editor-sortable-body"
                  onSortEnd={onMoveFieldEnd}
                  lockAxis="y"
                />

                {/* Add field */}
                <div>
                  <button
                    type="button"
                    className="btn btn-light btn-lg btn-block button-add"
                    onClick={(ev) => {
                      ev.preventDefault()
                      onAddFieldClick()
                    }}
                  >
                    Add Field
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div
              className="tab-pane"
              id="schema-editor-preview"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <SchemaPreview columns={columns} metadata={metadata} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Internal

const SortableFields = SortableContainer(
  (props: { columns: IDict[]; metadata: IDict }) => (
    <ul className="tableschema-ui-editor-sortable-list">
      {props.columns.map((column: IDict, index: number) => (
        <SortableField
          key={column.id}
          index={index}
          column={column}
          metadata={props.metadata}
        />
      ))}
    </ul>
  )
)

const SortableField = SortableElement((props: { column: IDict; metadata: IDict }) => (
  <li className="tableschema-ui-editor-sortable-item">
    <SchemaField key={props.column.id} column={props.column} metadata={props.metadata} />
  </li>
))
