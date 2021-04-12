import marked from 'marked'
import classNames from 'classnames'
import React, { useState } from 'react'
import { ReportTable } from './ReportTable'
import { IReportError } from '../report'

// ReportError

export interface IReportErrorProps {
  reportError: IReportError
  skipHeaderIndex?: boolean
}

export function ReportError(props: IReportErrorProps) {
  const { reportError, skipHeaderIndex } = props
  const [isDetailsVisible, setIsDetailsVisible] = useState(false)
  const [visibleRowsCount, setVisibleRowsCount] = useState(10)
  const rowNumbers = getRowNumbers(reportError)
  return (
    <div className="result">
      {/* Heading */}
      <div className="d-flex align-items-center">
        <span className="count">{reportError.count} x</span>
        <a
          role="button"
          className={classNames({
            badge: true,
            'badge-error': true,
            collapsed: !isDetailsVisible,
          })}
          data-toggle="collapse"
          onClick={() => setIsDetailsVisible(!isDetailsVisible)}
          aria-expanded="false"
        >
          {reportError.name}
        </a>
      </div>

      {/* Error details */}
      <div className={classNames(['collapse', { show: isDetailsVisible }])}>
        <div className="error-details">
          {reportError.description && (
            <div className="error-description">
              <div dangerouslySetInnerHTML={{ __html: marked(reportError.description) }} />
            </div>
          )}
          <div className="error-list">
            <p className="error-list-heading">The full list of error messages:</p>
            <ul>
              {reportError.messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Table view */}
      {!['source-error'].includes(reportError.code) && (
        <div className="table-view">
          <div className="inner">
            <ReportTable
              reportError={reportError}
              visibleRowsCount={visibleRowsCount}
              rowNumbers={rowNumbers}
              skipHeaderIndex={skipHeaderIndex}
            />
          </div>
        </div>
      )}

      {/* Show more */}
      {visibleRowsCount < rowNumbers.length && (
        <a className="show-more" onClick={() => setVisibleRowsCount(visibleRowsCount + 10)}>
          Show more <span className="icon-keyboard_arrow_down" />
        </a>
      )}
    </div>
  )
}

// Helpers

function getRowNumbers(reportError: IReportError) {
  return Object.keys(reportError.data)
    .map((item) => parseInt(item, 10))
    .sort((a, b) => a - b)
}
