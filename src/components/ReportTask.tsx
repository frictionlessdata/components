import React from 'react'
import classNames from 'classnames'
import { ReportError } from './ReportError'
import { IReportTask, IReportError } from '../report'
import * as helpers from '../helpers'

export interface IReportTaskProps {
  task: IReportTask
  taskNumber: number
  tasksCount: number
}

export function ReportTask(props: IReportTaskProps) {
  const { task, taskNumber, tasksCount } = props
  const taskFile = helpers.removeBaseUrl(task.resource.path)
  const splitTableFile = helpers.splitFilePath(taskFile)
  const reportErrors = getReportErrors(task)
  return (
    <div className={classNames({ file: true, valid: task.valid, invalid: !task.valid })}>
      {/* Heading */}
      <h4 className="file-heading">
        <div className="inner">
          <a className="file-name" href={task.resource.path}>
            <strong>{splitTableFile.base}</strong>
            <strong>{splitTableFile.sep}</strong>
            <strong>{splitTableFile.name}</strong>
            {!task.valid && (
              <span
                className="badge"
                data-toggle="tooltip"
                data-placement="right"
                title={`${task.stats.errors} errors found for this task`}
              >
                {task.stats.errors}
              </span>
            )}
          </a>
          <span className="file-count">
            Table {taskNumber} of {tasksCount}
          </span>
        </div>
      </h4>

      {/* Valid message */}
      {task.valid && (
        <ul className="passed-tests result">
          <li>
            <span className="badge badge-success">Valid Table</span>
          </li>
        </ul>
      )}

      {/* Error groups */}
      {Object.values(reportErrors).map((reportError) => (
        <ReportError key={reportError.code} reportError={reportError} />
      ))}
    </div>
  )
}

// Helpers

export function getReportErrors(task: IReportTask) {
  const reportErrors: { [code: string]: IReportError } = {}
  for (const error of task.errors) {
    const header = task.resource.schema.fields.map((field) => field.name)

    // Prepare reportError
    let reportError = reportErrors[error.code]
    if (!reportError) {
      reportError = {
        count: 0,
        code: error.code,
        name: error.name,
        description: error.description,
        header,
        messages: [],
        data: {},
      }
    }

    // Prepare cells
    let data = reportError.data[error.rowNumber || 0]
    if (!data) {
      let cells = error.cells || []
      if (!error.rowNumber) cells = header || []
      data = { cells, errors: new Set() }
    }

    // Ensure missing value
    if (error.code === 'missing-value') {
      data.cells[error.columnNumber - 1] = ''
    }

    // Add row errors
    if (error.columnNumber) {
      data.errors.add(error.columnNumber)
    } else if (data.cells) {
      data.errors = new Set(data.cells.map((_, index) => index + 1))
    }

    // Save reportError
    reportError.count += 1
    reportError.messages.push(error.message)
    reportError.data[error.rowNumber || 0] = data
    reportErrors[error.code] = reportError
  }

  return reportErrors
}
