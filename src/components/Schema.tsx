import React, { useState } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { SchemaFeedback, ISchemaFeedbackProps } from './SchemaFeedback'
import { SchemaPreview } from './SchemaPreview'
import { SchemaField } from './SchemaField'
import { IDict } from '../common'

export interface ISchemaProps {
  error: boolean
  loading: boolean
  disablePreview: boolean
  onSaveClick: any
}

export function Schema(props: ISchemaProps) {
  const [columns] = useState([] as IDict[])
  const [metadata] = useState({} as IDict)
  const [feedback] = useState({} as ISchemaFeedbackProps['feedback'])

  // Feedback Reset
  const onFeedbackReset = () => {}

  // Move Field End
  const onMoveFieldEnd = () => {}

  // Add Field
  const onAddFieldClick = () => {}

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
              {!props.error ? (
                <span>{!props.disablePreview && <small>1. </small>}Edit</span>
              ) : (
                <span>Error</span>
              )}
            </a>
          </li>

          {/* Preview */}
          {!props.loading && !props.error && !props.disablePreview && (
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
          {!props.loading && (
            <li className="nav-item">
              <a
                className="nav-link button-save"
                href="#"
                role="tab"
                aria-selected="false"
                onClick={(ev) => {
                  ev.preventDefault()
                  props.onSaveClick()
                }}
              >
                {!props.error ? (
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
        {!props.loading && !props.error && (
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
