import React from 'react'
import { optionLabels } from './../constants'

export type MultiSelectProps = {
  id: string
  checked: boolean
  onFieldChange: any
  name: string
  small: boolean
  disabled: boolean
}

export function ToggleSwitch(props: MultiSelectProps) {
  const handleKeyPress = (e: any) => {
    if (e.keyCode !== 32) return

    e.preventDefault()
    props.onFieldChange(!props.checked)
  }

  return (
    <div className={'toggle-switch' + (props.small ? ' small-switch' : '')}>
      <input
        type="checkbox"
        name={props.name}
        className="toggle-switch-checkbox"
        id={props.id}
        checked={props.checked}
        onChange={(e) => props.onFieldChange(e.target.checked)}
        disabled={props.disabled}
      />
      {props.id ? (
        <label
          className="toggle-switch-label"
          htmlFor={props.id}
          tabIndex={props.disabled ? -1 : 1}
          onKeyDown={(e) => {
            handleKeyPress(e)
          }}
        >
          <span
            className={
              props.disabled
                ? 'toggle-switch-inner toggle-switch-disabled'
                : 'toggle-switch-inner'
            }
            data-yes={optionLabels[0]}
            data-no={optionLabels[1]}
            tabIndex={-1}
          />
          <span
            className={
              props.disabled
                ? 'toggle-switch-switch toggle-switch-disabled'
                : 'toggle-switch-switch'
            }
            tabIndex={-1}
          />
        </label>
      ) : null}
    </div>
  )
}
