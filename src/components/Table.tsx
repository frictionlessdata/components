import React from 'react'
import classNames from 'classnames'
import defaultSpec from '../spec.json'
import { ErrorGroup } from './ErrorGroup'
import { getTableErrorGroups, removeBaseUrl, splitFilePath } from '../helpers'
import { ISpec, IReportTable } from '../common'

export interface ITableProps {
  table: IReportTable
  tableNumber: number
  tablesCount: number
  spec?: ISpec
  skipHeaderIndex?: boolean
}

export function Table(props: ITableProps) {
  const { table, tableNumber, tablesCount, spec, skipHeaderIndex } = props
  const tableFile = removeBaseUrl(table.source)
  const splitTableFile = splitFilePath(tableFile)
  const errorGroups = getTableErrorGroups(table)
  return (
    <div className={classNames({ file: true, valid: table.valid, invalid: !table.valid })}>
      {/* Heading */}
      <h4 className="file-heading">
        <div className="inner">
          <a className="file-name" href={table.source}>
            <strong>{splitTableFile.base}</strong>
            <strong>{splitTableFile.sep}</strong>
            <strong>{splitTableFile.name}</strong>
            {!table.valid && (
              <span
                className="badge"
                data-toggle="tooltip"
                data-placement="right"
                title={`${table['error-count']} errors found for this table`}
              >
                {table['error-count']}
              </span>
            )}
          </a>
          <span className="file-count">
            Table {tableNumber} of {tablesCount}
          </span>
        </div>
      </h4>

      {/* Valid message */}
      {table.valid && (
        <ul className="passed-tests result">
          <li>
            <span className="badge badge-success">Valid Table</span>
          </li>
        </ul>
      )}

      {/* Error groups */}
      {Object.values(errorGroups).map((errorGroup) => (
        <ErrorGroup
          key={errorGroup.code}
          errorGroup={errorGroup}
          spec={spec || defaultSpec}
          skipHeaderIndex={skipHeaderIndex}
        />
      ))}
    </div>
  )
}
