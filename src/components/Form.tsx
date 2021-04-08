import React, { useState } from 'react'
import { ISource, IOptions, IValidate, IReport, ISpec } from '../common'
import { MessageGroup } from './MessageGroup'
import { Report } from './Report'

export interface IFormProps {
  source: ISource
  options: IOptions
  validate: IValidate
  reportPromise?: Promise<IReport>
  spec?: ISpec
}

export function Form(props: IFormProps) {
  const [isSourceFile, setIsSourceFile] = useState(false)
  const [isSchemaFile, setIsSchemaFile] = useState(false)
  const [isLoading, setIsLoading] = useState(!!props.reportPromise)
  const [reportPromise, setReportPromise] = useState(props.reportPromise || null)
  // TODO: setting default values like doesn't seem to work
  const [source, setSource] = useState(props.source || '')
  // TODO: setting default values like doesn't seem to work
  const [options, setOptions] = useState(props.options || {})
  const [report, setReport] = useState(null as IReport | null)
  const [error, setError] = useState(null as Error | null)

  // Event handlers

  const onSourceTypeChange = () => {
    setIsSourceFile(!isSourceFile)
    onSourceChange('')
  }

  const onSchemaTypeChange = () => {
    setIsSchemaFile(!isSchemaFile)
    onOptionsChange('schema', '')
  }

  const onSourceChange = (source: ISource) => {
    setSource(source)
  }

  const onOptionsChange = (key: string, value: any) => {
    const newOptions = { ...options, [key]: value }
    if (!value) delete newOptions[key]
    setOptions(newOptions)
  }

  const onSubmit = () => {
    if (isDataPackage(source)) options.preset = 'datapackage'
    setReport(null)
    setError(null)
    setIsLoading(true)
    props
      .validate(source, { ...options })
      .then((report) => {
        setReport(report)
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error)
        setIsLoading(false)
      })
  }

  // Load report

  if (reportPromise) {
    reportPromise
      .then((report) => {
        setReport(report)
        setIsLoading(false)
        setReportPromise(null)
      })
      .catch((error) => {
        setError(error)
        setIsLoading(false)
        setReportPromise(null)
      })
  }

  // UI helpers

  const checkOptionsControls = [
    { key: 'blank-row', label: 'Ignore blank rows' },
    { key: 'duplicate-row', label: 'Ignore duplicate rows' },
  ]

  // Render

  return (
    <form className="frictionless-ui-form card card-default">
      <div className="row-source">
        <div className="form-inline">
          <label htmlFor="source">Source</label>&nbsp; [
          <a href="#" onClick={() => onSourceTypeChange()}>
            {isSourceFile ? 'Provide Link' : 'Upload File'}
          </a>
          ]
          <div className="input-group" style={{ width: '100%' }}>
            {!isSourceFile && (
              <input
                name="source"
                className="form-control"
                type="text"
                value={source as string}
                placeholder="http://data.source/url"
                onChange={(ev) => onSourceChange(ev.target.value)}
              />
            )}

            {isSourceFile && (
              <input
                name="source"
                className="form-control"
                type="file"
                placeholder="http://data.source/url"
                onChange={(ev) => !!ev.target.files && onSourceChange(ev.target.files[0])}
              />
            )}

            <div className="input-group-append">
              <div className="input-group-btn" style={{ width: '1%' }}>
                <button
                  className="btn btn-primary"
                  onClick={(ev) => {
                    ev.preventDefault()
                    onSubmit()
                  }}
                >
                  Validate
                </button>
              </div>
            </div>
          </div>
          <small>
            <strong>[REQUIRED]</strong> Add a data table to validate.
          </small>
        </div>
      </div>

      <div className="row-schema">
        <div className="row">
          <div className="form-group col-md-8">
            <label htmlFor="schema">Schema</label>&nbsp; [
            <a href="#" onClick={() => onSchemaTypeChange()}>
              {isSchemaFile ? 'Provide Link' : 'Upload File'}
            </a>
            ]
            {!isSchemaFile && (
              <input
                type="text"
                className="form-control"
                name="schema"
                value={options.schema}
                placeholder="http://table.schema/url"
                onChange={(ev) => onOptionsChange('schema', ev.target.value)}
              />
            )}
            {isSchemaFile && (
              <input
                type="file"
                className="form-control"
                name="schema"
                placeholder="http://table.schema/url"
                onChange={(ev) => onOptionsChange('schema', ev.target.files![0])}
              />
            )}
            <small>
              <strong>[OPTIONAL]</strong> Select to validate this data against a Table Schema (
              <a
                href="http://specs.frictionlessdata.io/table-schema/"
                target="_blank"
                rel="noopener noreferrer"
              >
                What is it?
              </a>
              ).
            </small>
          </div>

          <div className="form-group col-md-2">
            <div className="form-group">
              <label htmlFor="format">Format</label>
              <select
                name="format"
                value={options.format}
                className="form-control"
                onChange={(ev) => onOptionsChange('format', ev.target.value)}
              >
                <option value="">Auto</option>
                <option value="csv">CSV</option>
                <option value="gsheet">Google Sheet</option>
                <option value="json">JSON</option>
                <option value="ndjson">NDJSON</option>
                <option value="ods">ODS</option>
                <option value="tsv">TSV</option>
                <option value="xls">XLS</option>
                <option value="xlsx">XLSX</option>
              </select>
            </div>
          </div>

          <div className="col-md-2">
            <div className="form-group">
              <label htmlFor="encoding">Encoding</label>
              <select
                name="encoding"
                value={options.encoding}
                className="form-control"
                onChange={(ev) => onOptionsChange('encoding', ev.target.value)}
              >
                <option value="">Auto</option>
                <option value="utf-8">UTF-8</option>
                <option value="ascii">ASCII</option>
                <option value="iso-8859-2">ISO-8859-2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row-flags mt-3">
        <div className="row">
          {checkOptionsControls.map((item) => (
            <div className="col-md-6" key={item.key}>
              <div className="form-check">
                <input
                  id={item.key}
                  type="checkbox"
                  className="form-check-input"
                  checked={(options.checks || {})[item.key] === false}
                  onChange={(ev) => {
                    const checks = options.checks || {}
                    delete checks[item.key]
                    if (ev.target.checked) checks[item.key] = false
                    onOptionsChange('checks', checks)
                  }}
                />
                <label htmlFor={item.key} className="form-check-label">
                  {item.label}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="row-message">
          <div className="alert alert-info">Loading...</div>
        </div>
      )}

      {error && (
        <div className="row-message">
          <MessageGroup type="danger" title={'Error'} messages={[error.message]} />
        </div>
      )}

      {report && window.location.search && (
        <div className="row-message">
          <div className="alert alert-info">
            <strong>Permalink:</strong>&nbsp;
            <a href={window.location.href}>{window.location.href}</a>
          </div>
        </div>
      )}

      {report && (
        <div className="row-report">
          <Report report={report} spec={props.spec} />
        </div>
      )}
    </form>
  )
}

// Helpers

function isDataPackage(source: ISource) {
  const path = source instanceof window.File ? source.name : source
  return path.endsWith('datapackage.json')
}
