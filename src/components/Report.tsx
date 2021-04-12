import React from 'react'
import jsonschema from 'jsonschema'
import profile from '../profiles/report.json'
import { ReportTask } from './ReportTask'
import { IReport } from '../report'

export interface IReportProps {
  report: IReport
}

export function Report(props: IReportProps) {
  const { report } = props

  // Broken report
  const reportValidation = jsonschema.validate(report, profile)
  if (!reportValidation.valid) {
    return (
      <div className="frictionless-ui-report">
        <h5>
          <strong>Invalid report</strong>
        </h5>
        <hr />
        <div style={{ whiteSpace: 'pre', fontFamily: 'courier' }}>
          {JSON.stringify(reportValidation.errors, null, 2)}
        </div>
        <hr />
        <div style={{ whiteSpace: 'pre', fontFamily: 'courier' }}>
          {JSON.stringify(report, null, 2)}
        </div>
      </div>
    )
  }

  // Normal report
  const tasks = getSortedTasks(report)
  return (
    <div className="frictionless-ui-report">
      {/* Errors */}
      {!!report.errors.length && (
        <div className="file error">
          <h4 className="file-heading">
            <div className="inner">
              <a className="file-name">
                <strong>Errors</strong>
              </a>
            </div>
          </h4>
          <ul className="passed-tests result">
            {report.errors.map((error, index) => (
              <li key={index}>
                <span className="badge badge-error">{error.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tasks */}
      {tasks.map((task, index) => (
        <ReportTask key={index} task={task} taskNumber={index + 1} tasksCount={tasks.length} />
      ))}
    </div>
  )
}

// Helpers

function getSortedTasks(report: IReport) {
  return [
    ...report.tasks.filter((task) => !task.valid),
    ...report.tasks.filter((task) => task.valid),
  ]
}
