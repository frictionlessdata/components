import React from 'react'

export interface IMessageGroupProps {
  type: string
  title: string
  messages: string[]
}

export function MessageGroup(props: IMessageGroupProps) {
  const { type, title, messages } = props
  return (
    <div className={`alert alert-${type}`} role="alert">
      <span className="title">{title}</span>
      <hr />
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  )
}
