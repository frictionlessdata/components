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
  const [run, setRun] = useState(props.flow || '')
  const [report, setReport] = useState<IReport | null>(null)
  const [progress, setProgress] = useState(100)
  const [error, setError] = useState('')

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
            marginBottom: '15px',
            opacity: progress / 100,
          }}
        >
          <div className="form-row">
            <div className="col">
              <input
                name="user"
                id="user"
                placeholder="user"
                className="form-control"
                value={user}
                onChange={(ev) => setUser(ev.target.value)}
              />
            </div>
            <div className="col">
              <input
                name="repo"
                id="repo"
                placeholder="repo"
                className="form-control"
                value={repo}
                onChange={(ev) => setRepo(ev.target.value)}
              />
            </div>
            <div className="col">
              <input
                name="flow"
                id="flow"
                placeholder="flow"
                className="form-control"
                value={flow}
                onChange={(ev) => setFlow(ev.target.value)}
              />
            </div>
            <div className="col">
              <div className="row no-gutters">
                <div className="col-8">
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={!user || !repo || !flow}
                  >
                    Show
                  </button>
                </div>
                <div className="col-4">
                  <a
                    href={`https://github.com/${user}/${repo}/actions/runs/${run}`}
                    className={classNames([
                      'btn',
                      'btn-success',
                      'ml-2',
                      {
                        disabled: !user || !repo || !flow || !run,
                      },
                    ])}
                    style={{ width: '100%' }}
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
        <div>
          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          )}
        </div>
        <div>{report && <Report report={report} />}</div>
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
    const artifact = data.artifacts[0]
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
