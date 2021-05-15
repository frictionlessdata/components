import jszip from 'jszip'
import React, { useState } from 'react'
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
   * A GitHub workflow name
   */
  workflow?: string
  /**
   * A GitHub run id
   */
  run?: string
}

/**
 * Visual component for Frictionless Repository workflow
 */
export function Workflow(props: IWorkflowProps) {
  const { token, run } = props
  const [user, setUser] = useState(props.user || '')
  const [repo, setRepo] = useState(props.repo || '')
  const [workflow, setWorkflow] = useState(props.workflow || '')
  const [report, setReport] = useState<IReport | null>(null)

  // Submit
  const handleSubmit = async (ev: React.SyntheticEvent) => {
    ev.preventDefault()
    if (!user || !repo || !workflow) return
    const report = await loadReport({ token, user, repo, workflow, run })
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
                name="workflow"
                id="workflow"
                placeholder="workflow"
                className="form-control"
                value={workflow}
                onChange={(ev) => setWorkflow(ev.target.value)}
              />
            </div>
            <div className="col">
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Show
              </button>
            </div>
          </div>
        </form>
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
  workflow: string
  run?: string
}) {
  const { user, repo, workflow, token, run } = props

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
    const path = `/repos/${user}/${repo}/actions/workflows/${workflow}.yaml/runs`
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
    const runId = run || (await getRunId())
    const artifactId = await getArtifactId(runId)
    const fileBuffer = await getFileBuffer(artifactId)
    const report = await getReport(fileBuffer)
    return report
  } catch (error) {
    console.log(`Error in loading report: ${error}`)
  }
}
