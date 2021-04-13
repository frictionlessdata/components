import React, { useState } from 'react'
import { Report } from './Report'
import { IReport } from '../report'

export interface IReportDemoProps {
  report: IReport
}

export function ReportDemo(props: IReportDemoProps) {
  const [report, setReport] = useState(props.report)
  return (
    <div className="frictionless-ui-report-demo">
      <h1>Report Demo</h1>
      <textarea
        className="form-control"
        value={JSON.stringify(report, null, 2)}
        onChange={(ev) => setReport(JSON.parse(ev.target.value))}
      ></textarea>
      <Report report={report} />
    </div>
  )
}
