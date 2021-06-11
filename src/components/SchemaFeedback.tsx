import React from 'react'
import classNames from 'classnames'

export interface ISchemaFeedbackProps {
  onReset: () => void
  feedback: {
    message: string
    reset: boolean
    type: string
  }
}

export function SchemaFeedback(props: ISchemaFeedbackProps) {
  // Render
  return (
    <div className="tableschema-ui-editor-feedback">
      <div className={classNames('alert', `alert-${props.feedback.type}`)}>
        <span>{props.feedback.message}</span>
        {!!props.feedback.reset && (
          <span>
            &nbsp;To start from scratch please&nbsp;
            <a
              href="#"
              className="reset"
              onClick={(ev) => {
                ev.preventDefault()
                props.onReset()
              }}
            >
              click here
            </a>
            .
          </span>
        )}
      </div>
    </div>
  )
}
