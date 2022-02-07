import { find, omit, entries, forOwn } from 'lodash'
import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'
import { arrayMove } from 'react-sortable-hoc'
import { useAsyncEffect } from 'use-async-effect'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { SchemaFeedback, ISchemaFeedbackProps } from './SchemaFeedback'
import { SchemaPreview } from './SchemaPreview'
import { SchemaField } from './SchemaField'
import * as helpers from '../helpers'
import { IDict } from '../common'
import { UNIQUE, REQUIRED } from '../constants'
export interface ISchemaProps {
  source?: string | File
  schema: IDict | File
  onSave: any
  onSchemaChange?: (schema: any, error: any) => void
  disablePreview: boolean
  disableSave?: boolean
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
      setError(null)
      setLoading(false)
    }
  }, [])

  const memoizedExportSchema = useCallback(
    () => helpers.exportSchema(columns, metadata),
    [columns, metadata]
  )

  useEffect(() => {
    if (props.onSchemaChange) {
      const schema = memoizedExportSchema()
      props.onSchemaChange(schema, error)
    }
  }, [columns, metadata, error])

  // Save
  const saveSchema = () => {
    if (props.onSave) {
      const schema = memoizedExportSchema()
      props.onSave(schema, error)
    }
  }

  const setSchemaColumns = (columns: IDict<any>[], primaryKeys: string[] = []) => {
    const data = helpers.createColumns(columns, primaryKeys)
    setColumns([...data])
  }

  // Feedback Reset
  const resetFeedback = () => {
    console.log('Feedback')
  }

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

  // Update Constraint
  const updateConstraint = (id: number, setConstraint: string, value: any): void => {
    const column = find(columns, (column) => column.id === id)
    if (column) {
      const constrain: any = {}
      if (setConstraint === REQUIRED) {
        if (!value) {
          column.field.constraints = omit(column.field.constraints, REQUIRED)
        } else {
          constrain[REQUIRED] = value
        }
      }
      if (setConstraint === UNIQUE) {
        if (!value) {
          column.field.constraints = omit(column.field.constraints, UNIQUE)
        } else {
          constrain[UNIQUE] = value
        }
      }
      column.field.constraints = { ...column.field.constraints, ...constrain }
      if (entries(column.field.constraints).length < 1) {
        column.field = omit(column.field, 'constraints')
      }

      setColumns([...columns])
    }
  }

  // Move Field
  const moveField = (props: { oldIndex: number; newIndex: number }) => {
    setColumns([...arrayMove(columns, props.oldIndex, props.newIndex)])
  }

  const showTabNumber = !props.disablePreview && !props.disableSave

  const saveConstraint = (type: string, column: any) => {
    const constrain: any = []
    constrain.push(type)
    column.field.constraintList = column.field.constraintList
      ? [...column.field.constraintList, ...constrain]
      : constrain

    forOwn(column.field.constraintsAvailable, function (value) {
      if (value === type) {
        column.field.constraintsAvailable = column.field.constraintsAvailable.filter(
          (constr: any) => {
            if (constr !== type) {
              return constr
            }
            return null
          }
        )
      }
    })

    setColumns([...columns])
    updateConstraint(column.id, type, true)
  }

  const removeItem = (type: string, column: any) => {
    const constrain: any = []
    constrain.push(type)
    column.field.constraintsAvailable = [
      ...column.field.constraintsAvailable,
      ...constrain,
    ]

    forOwn(column.field.constraintList, function (value) {
      if (value === type) {
        column.field.constraintList = column.field.constraintList.filter(
          (constr: any) => {
            if (constr !== type) {
              return constr
            }
            return null
          }
        )
      }
    })

    setColumns([...columns])
    updateConstraint(column.id, type, false)
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
                <span>{showTabNumber && <small>1. </small>}Edit</span>
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
                {showTabNumber && <small>2. </small>}Preview
              </a>
            </li>
          )}

          {/* Save/Close */}
          {!loading && !props.disableSave && (
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
                  <span>{showTabNumber && <small>3. </small>}Save</span>
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
                    updateConstraint={updateConstraint}
                    saveConstraint={(val: any, column: any) =>
                      saveConstraint(val, column)
                    }
                    removeConstraint={(val: any, column: any) => removeItem(val, column)}
                    helperClass="frictionless-components-schema"
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
                <SchemaPreview
                  setSchemaColumns={setSchemaColumns}
                  columns={columns}
                  metadata={metadata}
                />
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
  (props: {
    columns: IDict[]
    metadata: IDict
    removeField: any
    updateField: any
    updateConstraint: any
    saveConstraint: any
    removeConstraint: any
  }) => (
    <ul className="tableschema-ui-editor-sortable-list">
      {props.columns.map((column: IDict, index: number) => (
        <SortableField
          key={column.id}
          index={index}
          column={column}
          metadata={props.metadata}
          removeField={props.removeField}
          updateField={props.updateField}
          updateConstraint={props.updateConstraint}
          saveConstraint={(val: any, column: any) => props.saveConstraint(val, column)}
          removeConstraint={(val: any, column: any) =>
            props.removeConstraint(val, column)
          }
        />
      ))}
    </ul>
  )
)

const SortableField = SortableElement(
  (props: {
    column: IDict
    metadata: IDict
    removeField: any
    updateField: any
    updateConstraint: any
    saveConstraint: any
    removeConstraint: any
  }) => (
    <li className="tableschema-ui-editor-sortable-item">
      <SchemaField
        key={props.column.id}
        column={props.column}
        metadata={props.metadata}
        removeField={props.removeField}
        updateField={props.updateField}
        updateConstraint={props.updateConstraint}
        saveConstraint={(val: any, column: any) => props.saveConstraint(val, column)}
        removeConstraint={(val: any, column: any) => props.removeConstraint(val, column)}
      />
    </li>
  )
)
