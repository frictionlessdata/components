import React from 'react'
import classNames from 'classnames'
import { IReportError } from '../report'

export type IReportTableProps = {
  reportError: IReportError
  visibleRowsCount: number
  rowNumbers: number[]
}

export function ReportTable(props: IReportTableProps) {
  const { reportError, visibleRowsCount, rowNumbers } = props
  const isHeaderVisible = reportError.tags.includes('#row')
  let afterFailRowNumber = 1
  if (rowNumbers[rowNumbers.length - 1]) {
    afterFailRowNumber = rowNumbers[rowNumbers.length - 1] + 1
  } else {
    afterFailRowNumber = 2
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
        {rowNumbers.map(
          (rowNumber, index) =>
            index < visibleRowsCount && (
              <tr key={index} className={classNames({ fail: reportError.code.includes('row') })}>
                <td className="result-row-index">{rowNumber || 1}</td>
                {reportError.data[rowNumber].cells.map((cell, innerIndex) => (
                  <td
                    key={innerIndex}
                    className={classNames({
                      fail: reportError.data[rowNumber].errors.has(innerIndex + 1),
                    })}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            )
        )}
        <tr className="after-fail">
          <td className="result-row-index">{afterFailRowNumber}</td>
          {reportError.header && reportError.header.map((_, index) => <td key={index} />)}
        </tr>
      </tbody>
    </table>
  )
}
