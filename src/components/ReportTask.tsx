import React from 'react'
import classNames from 'classnames'
import defaultSpec from '../spec.json'
import { ReportError } from './ReportError'
import { getTaskReportErrors, removeBaseUrl, splitFilePath } from '../helpers'
import { ISpec, IReportTask } from '../common'

export interface IReportTaskProps {
  task: IReportTask
  taskNumber: number
  tasksCount: number
  spec?: ISpec
  skipHeaderIndex?: boolean
}

export function ReportTask(props: IReportTaskProps) {
  const { task, taskNumber, tasksCount, spec, skipHeaderIndex } = props
  const taskFile = removeBaseUrl(task.source)
  const splitTableFile = splitFilePath(taskFile)
  const errorGroups = getTaskReportErrors(task)
  return (
    <div className={classNames({ file: true, valid: task.valid, invalid: !task.valid })}>
      {/* Heading */}
      <h4 className="file-heading">
        <div className="inner">
          <a className="file-name" href={task.source}>
            <strong>{splitTableFile.base}</strong>
            <strong>{splitTableFile.sep}</strong>
            <strong>{splitTableFile.name}</strong>
            {!task.valid && (
              <span
                className="badge"
                data-toggle="tooltip"
                data-placement="right"
                title={`${task['error-count']} errors found for this task`}
              >
                {task['error-count']}
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
      {Object.values(errorGroups).map((errorGroup) => (
        <ReportError
          key={errorGroup.code}
          errorGroup={errorGroup}
          spec={spec || defaultSpec}
          skipHeaderIndex={skipHeaderIndex}
        />
      ))}
    </div>
  )
}
