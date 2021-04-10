import React from 'react'
import classNames from 'classnames'
import { ReportError } from './ReportError'
import { IReportTask } from '../report'
import * as helpers from '../helpers'

export interface IReportTaskProps {
  task: IReportTask
  taskNumber: number
  tasksCount: number
  skipHeaderIndex?: boolean
}

export function ReportTask(props: IReportTaskProps) {
  const { task, taskNumber, tasksCount, skipHeaderIndex } = props
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
        <ReportError
          key={reportError.code}
          reportError={reportError}
          skipHeaderIndex={skipHeaderIndex}
        />
      ))}
    </div>
  )
}

// Helpers

export function getReportErrors(task: IReportTask) {
  const groups: { [code: string]: IReportError } = {}
  for (const error of task.errors) {
    // Get group
    let group = groups[error.code]

    // Create group
    if (!group) {
      group = {
        code: error.code,
        rows: {},
        count: 0,
        headers: task.headers,
        messages: [],
      }
    }

    // Get row
    let row = group.rows[error['row-number'] || 0]

    // Create row
    if (!row) {
      let values = error.row || []
      if (!error['row-number']) {
        values = task.headers || []
      }
      row = {
        values,
        badcols: new Set(),
      }
    }

    // Ensure missing value
    if (error.code === 'missing-value') {
      row.values[error['column-number']! - 1] = ''
    }

    // Add row badcols
    if (error['column-number']) {
      row.badcols.add(error['column-number'])
    } else if (row.values) {
      row.badcols = new Set(row.values.map((_value, index) => index + 1))
    }

    // Save group
    group.count += 1
    group.messages.push(error.message)
    group.rows[error['row-number'] || 0] = row
    groups[error.code] = group
  }
  return groups
}
