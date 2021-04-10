import marked from 'marked'
import classNames from 'classnames'
import hexToRgba from 'hex-to-rgba'
import React, { useState } from 'react'
import startCase from 'lodash/startCase'
import defaultSpec from '../spec.json'
import { ReportTable } from './ReportTable'
import { ISpec, ISpecError, IReportError } from '../common'

// ReportError

export interface IReportError {
  code: string
  count: number
  headers: string[]
  messages: string[]
  rows: { [rowNumber: number]: IReportErrorRow }
}

export interface IReportErrorRow {
  values: any[]
  badcols: Set<number>
}

export interface IReportErrorProps {
  reportError: IReportError
  spec?: ISpec
  skipHeaderIndex?: boolean
}

export function ReportError(props: IReportErrorProps) {
  const { reportError, spec, skipHeaderIndex } = props
  const [isDetailsVisible, setIsDetailsVisible] = useState(false)
  const [visibleRowsCount, setVisibleRowsCount] = useState(10)
  const specError = getSpecError(reportError, spec || defaultSpec)
  const isHeadersVisible = getIsHeadersVisible(specError)
  const description = getDescription(specError)
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
          style={{ backgroundColor: getRgbaColor(specError) }}
        >
          {specError.name}
        </a>
      </div>

      {/* Error details */}
      <div className={classNames(['collapse', { show: isDetailsVisible }])}>
        <div className="error-details" style={{ borderColor: getRgbaColor(specError) }}>
          {description && (
            <div className="error-description">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          )}
          <div className="error-list" style={{ borderTopColor: getRgbaColor(specError) }}>
            <p
              className="error-list-heading"
              style={{
                backgroundColor: getRgbaColor(specError, 0.1),
                borderBottomColor: getRgbaColor(specError, 0.25),
              }}
            >
              The full list of error messages:
            </p>
            <ul
              style={{
                backgroundColor: getRgbaColor(specError, 0.05),
              }}
            >
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
              specError={specError}
              reportError={reportError}
              visibleRowsCount={visibleRowsCount}
              rowNumbers={rowNumbers}
              isHeadersVisible={isHeadersVisible}
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

function getSpecError(reportError: IReportError, spec: ISpec) {
  // Get code handling legacy codes
  let code = reportError.code
  if (code === 'non-castable-value') {
    code = 'type-or-format-error'
  }

  // Get details handling custom errors
  let details = spec.errors[code]
  if (!details) {
    details = {
      name: startCase(code),
      type: 'custom',
      context: 'body',
      message: 'custom',
      description: '',
      weight: 0,
    }
  }

  return details
}

function getRgbaColor(specError: ISpecError, alpha: number = 1) {
  return specError.hexColor ? hexToRgba(specError.hexColor, alpha) : undefined
}

function getIsHeadersVisible(specError: ISpecError) {
  return specError.context === 'body'
}

function getDescription(specError: ISpecError) {
  let description = specError.description
  if (description) {
    description = description.replace('{validator}', '`frictionless.yml`')
    description = marked(description)
  }
  return description
}

function getRowNumbers(reportError: IReportError) {
  return Object.keys(reportError.rows)
    .map((item) => parseInt(item, 10))
    .sort((a, b) => a - b)
}
