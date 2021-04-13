import React from 'react'
import classNames from 'classnames'
import { IReportError } from '../report'

export type IReportTableProps = {
  reportError: IReportError
  visibleRowsCount: number
  rowPositions: number[]
}

export function ReportTable(props: IReportTableProps) {
  const { reportError, visibleRowsCount, rowPositions } = props
  const isHeaderVisible = reportError.tags.includes('#row')
  let afterFailRowPosition = 1
  if (rowPositions[rowPositions.length - 1]) {
    afterFailRowPosition = rowPositions[rowPositions.length - 1] + 1
  } else {
    afterFailRowPosition = 2
  }
  return (
    <table className="table table-sm">
      <tbody>
        {reportError.header && isHeaderVisible && (
          <tr className="before-fail">
            <td className="text-center">1</td>
            {reportError.header.map((label, index) => (
              <td key={index}>{label}</td>
            ))}
          </tr>
        )}
        {rowPositions.map(
          (rowPosition, index) =>
            index < visibleRowsCount && (
              <tr key={index} className={classNames({ fail: reportError.code.includes('row') })}>
                <td className="result-row-index">{rowPosition || 1}</td>
                {reportError.data[rowPosition].cells.map((cell, innerIndex) => (
                  <td
                    key={innerIndex}
                    className={classNames({
                      fail: reportError.data[rowPosition].errors.has(innerIndex + 1),
                    })}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            )
        )}
        <tr className="after-fail">
          <td className="result-row-index">{afterFailRowPosition}</td>
          {reportError.header && reportError.header.map((_, index) => <td key={index} />)}
        </tr>
      </tbody>
    </table>
  )
}
