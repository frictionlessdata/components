import React, { useState } from 'react'
import { Report } from './Report'

export interface IWorkflowProps {
  /**
   * A GitHub token with `publi_repo` permissions
   */
  token: string
}

/**
 * Visual component for Frictionless Report rendering
 */
export function Workflow(props: IWorkflowProps) {
  const { token } = props
  const [user, setUser] = useState(null)
  const [repo, setRepo] = useState(null)
  const [workflow, setWorkflow] = useState(null)
  const [report, setReport] = useState(null)
  return (
    <div className="frictionless-components-workflow">
      <div className="container">
        <form
          style={{
            paddingBottom: '30px',
            borderBottom: 'solid 1px #ddd',
            marginBottom: '15px',
          }}
        >
          <div className="form-row">
            <div className="col">
              <input name="user" id="user" placeholder="user" className="form-control" />
            </div>
            <div className="col">
              <input name="repo" id="repo" placeholder="repo" className="form-control" />
            </div>
            <div className="col">
              <input
                name="workflow"
                id="workflow"
                placeholder="workflow"
                className="form-control"
              />
            </div>
            <div className="col">
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Show
              </button>
            </div>
          </div>
        </form>
        <div id="report"></div>
      </div>
    </div>
  )
}
