import jszip from 'jszip'
import classNames from 'classnames'
import React, { useState } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import { Report } from './Report'
import { IReport } from '../report'
import { IDict } from '../common'

export interface IWorkflowProps {
  /**
   * A GitHub token with `public_repo` permissions
   */
  token: string
  /**
   * A GitHub user name
   */
  user?: string
  /**
   * A GitHub repo name
   */
  repo?: string
  /**
   * A GitHub flow name
   */
  flow?: string
  /**
   * A GitHub run id
   */
  run?: string
  /**
   * A callback on submit
   */
  callback?: (
    error: Error | undefined,
    props: {
      user: string
      repo: string
      flow: string
      run?: string
    }
  ) => void
}

/**
 * Visual component for Frictionless Repository flow
 */
export function Workflow(props: IWorkflowProps) {
  const { token, callback } = props
  const [user, setUser] = useState(props.user || '')
  const [repo, setRepo] = useState(props.repo || '')
  const [flow, setFlow] = useState(props.flow || '')
  const [run, setRun] = useState(props.run || '')
  const [report, setReport] = useState<IReport | null>(null)
  const [progress, setProgress] = useState(100)
  const [error, setError] = useState('')
  const [badge, setBadge] = useState(false)
  const isFormDisabled = !user || !repo || !flow
  const isLinkDisabled = !user || !repo || !flow || !run

  // Mount
  useAsyncEffect(async (isMounted) => {
    if (!user || !repo || !flow) return
    const report = await loadReport({ token, user, repo, flow, run, setRun, setProgress })
    if (!report) return setError('Cannot load a report')
    if (!isMounted()) return
    if (callback) callback(undefined, { user, repo, flow, run })
    setReport(report)
  }, [])

  // Submit
  const handleSubmit = async (ev: React.SyntheticEvent) => {
    ev.preventDefault()
    if (!user || !repo || !flow) return
    setReport(null)
    setError('')
    const report = await loadReport({ token, user, repo, flow, setRun, setProgress })
    if (!report) return setError('Cannot load a report')
    if (callback) callback(undefined, { user, repo, flow, run })
    setReport(report)
  }

  // Render
  return (
    <div className="frictionless-components-workflow">
      <div className="container">
        <form
          onSubmit={handleSubmit}
          style={{
            paddingBottom: '30px',
            borderBottom: 'solid 1px #ddd',
            marginBottom: '30px',
            opacity: progress / 100,
          }}
        >
          <div className="form-row">
            <div className="col-lg-3 mb-3 mb-lg-0">
              <input
                name="user"
                id="user"
                placeholder="user"
                className="form-control"
                value={user}
                onChange={(ev) => {
                  setUser(ev.target.value)
                  setRun('')
                  setReport(null)
                  setError('')
                  setBadge(false)
                }}
              />
            </div>
            <div className="col-lg-3 mb-3 mb-lg-0">
              <input
                name="repo"
                id="repo"
                placeholder="repo"
                className="form-control"
                value={repo}
                onChange={(ev) => {
                  setRepo(ev.target.value)
                  setRun('')
                  setReport(null)
                  setError('')
                  setBadge(false)
                }}
              />
            </div>
            <div className="col-lg-3 mb-3 mb-lg-0">
              <input
                name="flow"
                id="flow"
                placeholder="flow"
                className="form-control"
                value={flow}
                onChange={(ev) => {
                  setFlow(ev.target.value)
                  setRun('')
                  setReport(null)
                  setError('')
                  setBadge(false)
                }}
              />
            </div>
            <div className="col-lg-3">
              <div className="form-row">
                <div className="col-sm-4 mb-2 mb-sm-0">
                  <button
                    title={isFormDisabled ? '' : 'Open the report'}
                    className={classNames('w-100', 'btn', 'btn-primary', {
                      disabled: isFormDisabled,
                    })}
                    style={{ cursor: isFormDisabled ? 'default' : 'pointer' }}
                    disabled={isFormDisabled}
                  >
                    Show
                  </button>
                </div>
                <div className="col-sm-4 mb-2 mb-sm-0">
                  <a
                    title="Open the badge"
                    className={classNames('w-100', 'btn', 'btn-info', {
                      disabled: !badge && isLinkDisabled,
                    })}
                    onClick={() => setBadge(!badge)}
                    style={{ color: 'white' }}
                  >
                    Badge
                  </a>
                </div>
                <div className="col-sm-4">
                  <a
                    title="Open the workflow"
                    href={`https://github.com/${user}/${repo}/actions/runs/${run}`}
                    className={classNames('w-100', 'btn', 'btn-success', {
                      disabled: isLinkDisabled,
                    })}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Link
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
        {badge && (
          <div
            style={{
              paddingBottom: '30px',
              borderBottom: 'solid 1px #ddd',
              marginBottom: '30px',
            }}
          >
            <div className="form-row">
              <div className="col-sm-9">
                <div className="mt-2">
                  <big>
                    <strong>Insert this code snippet into your README.md file</strong>
                  </big>
                </div>
              </div>
              <div className="col-sm-3">
                <img
                  style={{ height: '30px', float: 'right' }}
                  src={`https://github.com/${user}/${repo}/actions/workflows/${flow}.yaml/badge.svg`}
                />
              </div>
            </div>
            <div className="form-group mt-2">
              <textarea
                spellCheck="false"
                style={{ color: '#777', minHeight: '6em', marginTop: '1em' }}
                className="form-control"
                defaultValue={`[![${
                  flow.charAt(0).toUpperCase() + flow.slice(1)
                }](https://github.com/${user}/${repo}/actions/workflows/${flow}.yaml/badge.svg)](https://repository.frictionlessdata.io/report?user=${user}&repo=${repo}&flow=${flow})`}
              ></textarea>
            </div>
          </div>
        )}
        {error && (
          <div className="alert alert-danger mt-4" role="alert">
            {error}
          </div>
        )}
        {report && <Report report={report} />}
      </div>
    </div>
  )
}

// Helpers

async function loadReport(props: {
  token: string
  user: string
  repo: string
  flow: string
  run?: string
  setRun: (run: string) => void
  setProgress: (progress: number) => void
}) {
  const { token, user, repo, flow, run, setRun, setProgress } = props

  // Request
  async function makeRequest(path: string) {
    return fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${token}`,
      },
    })
  }

  // Run
  async function getRunId() {
    const path = `/repos/${user}/${repo}/actions/workflows/${flow}.yaml/runs`
    const res = await makeRequest(path)
    const data = await res.json()
    const run = data.workflow_runs.filter((item: IDict) => item.status === 'completed')[0]
    return run.id
  }

  // Artifact
  async function getArtifactId(runId: string) {
    const path = `/repos/${user}/${repo}/actions/runs/${runId}/artifacts`
    const res = await makeRequest(path)
    const data = await res.json()
    const artifact = data.artifacts.filter((item: IDict) => item.name === 'report')[0]
    return artifact.id
  }

  // File
  async function getFileBuffer(artifactId: string) {
    const path = `/repos/${user}/${repo}/actions/artifacts/${artifactId}/zip`
    const res = await makeRequest(path)
    const buffer = await res.blob()
    return buffer
  }

  // Report
  async function getReport(buffer: Blob) {
    const archive = await jszip.loadAsync(buffer)
    const contents = await archive.file('report.json')!.async('string')
    const report = JSON.parse(contents)
    return report
  }

  // Main
  try {
    setProgress(20)
    const runId = run || (await getRunId())
    setRun(runId.toString())
    setProgress(40)
    const artifactId = await getArtifactId(runId)
    setProgress(60)
    const fileBuffer = await getFileBuffer(artifactId)
    setProgress(80)
    const report = await getReport(fileBuffer)
    setProgress(100)
    return report
  } catch (error) {
    setProgress(100)
    console.log(`Error in loading report: ${error}`)
  }
}
