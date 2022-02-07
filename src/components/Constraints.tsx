import React, { useState } from 'react'
import { UNIQUE, REQUIRED } from '../constants'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from 'reactstrap'
import { ToggleSwitch } from './toggleSwitch'

/**
 *
 */
export type MultiSelectProps = {
  toggleModal: any
  saveConstraint: any
  removeConstraint: any
  column: any
}

export function Constraints(props: MultiSelectProps) {
  const [constraint, setConstraint] = useState<string>('')
  const [toggleConstraint, setToggleConstraint] = useState(false)
  const [requiredChecked, setRequiredChecked] = useState(true)
  const [uniqueChecked, setUniqueChecked] = useState(true)

  const toggleDropDown = () => {
    setToggleConstraint(!toggleConstraint)
  }

  const selectConstraint = (type: string) => {
    if (type === REQUIRED) {
      setConstraint(REQUIRED)
    }
    if (type === UNIQUE) {
      setConstraint(UNIQUE)
    }
  }

  const setConstraintChecked = (value: boolean) => {
    if (constraint === REQUIRED) {
      setRequiredChecked(value)
    } else if (constraint === UNIQUE) {
      setUniqueChecked(value)
    }
  }

  const setDropdown = () => {
    return constraint || props.column.field.constraintsAvailable[0]
  }

  const currentDate = () => {
    return new Date().toLocaleString().split(',')[0]
  }

  return (
    <div className="multiselect">
      <div className="multiselect-grid">
        <div className="multiselect-column seprator">
          <div className="multiselect-body">
            {props.column.field ? props.column.field.name : ''}
            <br />
            <Dropdown toggle={toggleDropDown} isOpen={toggleConstraint}>
              <DropdownToggle caret>{setDropdown()}</DropdownToggle>
              <DropdownMenu>
                {props.column.field.constraintsAvailable &&
                  props.column.field.constraintsAvailable.map((constraint: any) => (
                    <DropdownItem
                      key={'id-' + constraint}
                      onClick={() => selectConstraint(constraint)}
                    >
                      {constraint}
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </Dropdown>

            {constraint === REQUIRED && (
              <div>
                Required Constraint: <br />
                <ToggleSwitch
                  id="onoffConstraint"
                  checked={requiredChecked}
                  onFieldChange={(val: boolean) => setConstraintChecked(val)}
                  name="toggle"
                  small={false}
                  disabled={true}
                ></ToggleSwitch>
              </div>
            )}

            {constraint === UNIQUE && (
              <div>
                Unique Constraint: <br />
                <ToggleSwitch
                  id="switchUnique"
                  checked={uniqueChecked}
                  onFieldChange={(val: boolean) => setConstraintChecked(val)}
                  name="toggle"
                  small={false}
                  disabled={true}
                ></ToggleSwitch>
              </div>
            )}
          </div>

          <div className="multiselect-footer">
            <button className="cancel-btn" type="button" onClick={props.toggleModal}>
              Cancel
            </button>
            <button
              className="save-btn"
              type="button"
              disabled={!constraint}
              onClick={() => {
                setConstraint('')
                props.saveConstraint(constraint)
              }}
            >
              Save
            </button>
          </div>
        </div>

        <div className="multiselect-column">
          <div className="multiselect-header">
            <h5>Previously added</h5>
          </div>
          <div className="multiselect-body">
            <Table>
              <thead>
                <tr>
                  <th>Constraint</th>
                  <th>Value</th>
                  <th>Added By</th>
                  <th>Effective Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {props.column.field.constraintList &&
                  props.column.field.constraintList.map((value: any) => {
                    return (
                      <tr key={value}>
                        <th scope="row">{value}</th>
                        <td>true</td>
                        <td>Mark</td>
                        <td>{currentDate()}</td>
                        <td>
                          <button
                            className="btn-close"
                            onClick={() => props.removeConstraint(value)}
                          ></button>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
