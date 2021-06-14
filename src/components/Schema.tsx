import { find } from 'lodash'
import classNames from 'classnames'
import React, { useState } from 'react'
import { arrayMove } from 'react-sortable-hoc'
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
  const [tab, setTab] = useState('edit' as 'edit' | 'preview')
  const [error, setError] = useState(null as null | Error)
  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState([] as IDict[])
  const [metadata, setMetadata] = useState({} as IDict)
  const [feedback] = useState({} as ISchemaFeedbackProps['feedback'])

  // Mount
  useAsyncEffect(async () => {
    try {
      setLoading(false)
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
  const saveSchema = () => {
    if (props.onSave) {
      const schema = helpers.exportSchema(columns, metadata)
      props.onSave(schema, error)
    }
  }

  // Feedback Reset
  const resetFeedback = () => {}

  // Add Field
  const addField = () => {
    setColumns([...columns, helpers.createColumn(columns.length)])
  }

  // Remove Field
  const removeField = (id: number): void => {
    const newColumns = columns.filter((column) => column.id !== id)
    setColumns([...newColumns])
  }

  // Update Field
  const updateField = (id: number, name: string, value: any): void => {
    const column = find(columns, (column) => column.id === id)
    if (column) {
      column.field[name] = value
      setColumns([...columns])
    }
  }

  // Move Field
  const moveField = (props: { oldIndex: number; newIndex: number }) => {
    setColumns([...arrayMove(columns, props.oldIndex, props.newIndex)])
  }

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
          <li className={classNames('nav-item', { active: tab === 'edit' })}>
            <a
              className="nav-link button-edit"
              data-toggle="tab"
              role="tab"
              onClick={() => {
                setTab('edit')
              }}
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
            <li className={classNames('nav-item', { active: tab === 'preview' })}>
              <a
                className="nav-link button-preview"
                data-toggle="tab"
                role="tab"
                onClick={() => {
                  setTab('preview')
                }}
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
                role="tab"
                aria-selected="false"
                onClick={(ev) => {
                  ev.preventDefault()
                  saveSchema()
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
        <SchemaFeedback feedback={feedback} onReset={resetFeedback} />

        {/* Tab contents */}
        {!loading && !error && (
          <div className="tab-content content">
            {/* Edit */}
            {tab === 'edit' && (
              <div
                role="tabpanel"
                className={classNames('tab-pane', { active: tab === 'edit' })}
              >
                <div className="form-group fields">
                  {/* List fields */}
                  <SortableFields
                    columns={columns}
                    metadata={metadata}
                    removeField={removeField}
                    updateField={updateField}
                    helperClass="tableschema-ui-editor-sortable-body"
                    onSortEnd={moveField}
                    lockAxis="y"
                  />

                  {/* Add field */}
                  <div>
                    <button
                      type="button"
                      className="btn btn-light btn-lg btn-block button-add"
                      onClick={(ev) => {
                        ev.preventDefault()
                        addField()
                      }}
                    >
                      Add Field
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {tab === 'preview' && (
              <div
                role="tabpanel"
                className={classNames('tab-pane', { active: tab === 'preview' })}
              >
                <SchemaPreview columns={columns} metadata={metadata} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Internal

const SortableFields = SortableContainer(
  (props: { columns: IDict[]; metadata: IDict; removeField: any; updateField: any }) => (
    <ul className="tableschema-ui-editor-sortable-list">
      {props.columns.map((column: IDict, index: number) => (
        <SortableField
          key={column.id}
          index={index}
          column={column}
          metadata={props.metadata}
          removeField={props.removeField}
          updateField={props.updateField}
        />
      ))}
    </ul>
  )
)

const SortableField = SortableElement(
  (props: { column: IDict; metadata: IDict; removeField: any; updateField: any }) => (
    <li className="tableschema-ui-editor-sortable-item">
      <SchemaField
        key={props.column.id}
        column={props.column}
        metadata={props.metadata}
        removeField={props.removeField}
        updateField={props.updateField}
      />
    </li>
  )
)
