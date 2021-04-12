import React from 'react'
import classNames from 'classnames'
import hexToRgba from 'hex-to-rgba'
import { ISpecError, IReportError } from '../common'

export type IReportTableProps = {
  reportError: IReportError
  visibleRowsCount: number
  rowNumbers: number[]
  skipHeaderIndex?: boolean
}

export function ReportTable(props: IReportTableProps) {
  const {
    specError,
    reportError,
    visibleRowsCount,
    rowNumbers,
    isHeadersVisible,
    skipHeaderIndex,
  } = props
  let afterFailRowNumber = 1
  if (rowNumbers[rowNumbers.length - 1]) {
    afterFailRowNumber = rowNumbers[rowNumbers.length - 1] + 1
  } else if (skipHeaderIndex) {
    afterFailRowNumber = 1
  } else {
    afterFailRowNumber = 2
  }
  return (
    <table className="table table-sm">
      <tbody>
        {reportError.headers && isHeadersVisible && (
          <tr className="before-fail">
            <td className="text-center">{skipHeaderIndex ? '' : '1'}</td>
            {reportError.headers.map((header, index) => (
              <td key={index}>{header}</td>
            ))}
          </tr>
        )}
        {rowNumbers.map(
          (rowNumber, index) =>
            index < visibleRowsCount && (
              <tr key={index} className={classNames({ fail: reportError.code.includes('row') })}>
                <td
                  style={{ backgroundColor: getRgbaColor(specError, 0.25) }}
                  className="result-row-index"
                >
                  {rowNumber || (skipHeaderIndex ? '' : 1)}
                </td>
                {reportError.rows[rowNumber].values.map((value, innerIndex) => (
                  <td
                    key={innerIndex}
                    style={{ backgroundColor: getRgbaColor(specError, 0.25) }}
                    className={classNames({
                      fail: reportError.rows[rowNumber].badcols.has(innerIndex + 1),
                    })}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            )
        )}
        <tr className="after-fail">
          <td className="result-row-index">{afterFailRowNumber}</td>
          {reportError.headers && reportError.headers.map((_header, index) => <td key={index} />)}
        </tr>
      </tbody>
    </table>
  )
}

// Helpers

function getRgbaColor(specError: ISpecError, alpha: number = 1) {
  return specError.hexColor ? hexToRgba(specError.hexColor, alpha) : undefined
}
