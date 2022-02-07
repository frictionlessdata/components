import React, { useState } from 'react'
import { IDict } from '../common'
import * as helpers from '../helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import {
  Modal,
  ModalBody,
  ModalHeader,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { Constraints } from './Constraints'
export interface ISchemaFieldProps {
  column: IDict
  metadata: IDict
  removeField: any
  updateField: any
  updateConstraint: any
  saveConstraint: any
  removeConstraint: any
}

export function SchemaField(props: ISchemaFieldProps) {
  const types = helpers.getFieldTypes()
  const formats = helpers.getFieldFormats(props.column.field.type)
  const [isDetails, setIsDetails] = useState(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <div className="tableschema-ui-editor-field">
      {/* General */}
      <div className="row">
        {/* Name */}
        <div className="col-md-2 name">
          <div className="handle">&equiv;</div>
          <div className="input-group">
            <div className="input-group-addon">
              <div>Name</div>
            </div>
            <input
              type="text"
              className="form-control"
              defaultValue={props.column.field.name}
              onBlur={(ev) => props.updateField(props.column.id, 'name', ev.target.value)}
            />
          </div>
        </div>

        {/* Title */}
        <div className="col-md-2 title">
          <div className="input-group">
            <div className="input-group-addon">
              <div>Title</div>
            </div>
            <input
              type="text"
              className="form-control"
              defaultValue={props.column.field.title}
              onBlur={(ev) =>
                props.updateField(props.column.id, 'title', ev.target.value)
              }
            />
          </div>
        </div>

        {/* Description */}
        <div className="col-md-2">
          <div className="input-group">
            <div className="input-group-addon">
              <div>Description</div>
            </div>
            <input
              type="text"
              className="form-control"
              defaultValue={props.column.field.description}
              onBlur={(ev) =>
                props.updateField(props.column.id, 'description', ev.target.value)
              }
            />
          </div>
        </div>

        {/* Type */}
        <div className="col-md-2 type">
          <div className="input-group">
            <div className="input-group-addon">
              <div>Type</div>
            </div>
            <select
              className="form-control"
              value={props.column.field.type}
              onChange={(ev) => {
                props.updateField(props.column.id, 'format', 'default')
                props.updateField(props.column.id, 'type', ev.target.value)
              }}
            >
              {types.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Format */}
        <div className="col-md-2">
          <div className="input-group">
            <div className="input-group-addon">
              <div>Format</div>
            </div>
            <Format
              formats={formats}
              format={props.column.field.format}
              onChange={(ev: any) => {
                props.updateField(props.column.id, 'format', ev.target.value)
              }}
            />
          </div>
        </div>

        {/* PrimaryKey */}
        <div className="col-md-1">
          <div className="input-group">
            <div className="input-group-addon">
              <div>Primary Key</div>
            </div>
            <Checkbox
              format={props.column.field.primaryKey}
              onChange={(ev: any) => {
                props.updateField(props.column.id, 'primaryKey', ev.currentTarget.checked)
              }}
            />
          </div>
        </div>

        {/* Action Menu */}
        <div className="col-md-1 ">
          <span className="menu-options">
            <span className="menu-dropdown">
              <Dropdown
                isOpen={isDetails}
                toggle={() => setIsDetails(!isDetails)}
                direction="start"
              >
                <DropdownToggle>
                  <FontAwesomeIcon icon={faEllipsisV} className="fa-icon" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setModalOpen(true)}>
                    Add Schema Constraints
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Another Action</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Modal
                centered
                isOpen={modalOpen}
                size="xl"
                toggle={() => setModalOpen(false)}
              >
                <ModalHeader toggle={() => setModalOpen(false)}>
                  Constraints/Validations
                </ModalHeader>
                <ModalBody>
                  <Constraints
                    column={props.column}
                    toggleModal={() => setModalOpen(false)}
                    saveConstraint={(val: any) => props.saveConstraint(val, props.column)}
                    removeConstraint={(val: any) =>
                      props.removeConstraint(val, props.column)
                    }
                  />
                </ModalBody>
              </Modal>
            </span>

            {/* Remove */}
            <button
              type="button"
              className="btn btn-light btn-lg button-remove"
              onClick={(ev) => {
                ev.preventDefault()
                props.removeField(props.column.id)
              }}
            >
              <FontAwesomeIcon
                onClick={(ev: any) => {
                  ev.preventDefault()
                  props.removeField(props.column.id)
                }}
                icon={faTimesCircle}
                className="fa-icon"
              />
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}

// Internal
function Format(props: { formats: string[]; format: string; onChange: any }) {
  if (!props.formats.includes('custom')) {
    return (
      <select className="form-control" value={props.format} onChange={props.onChange}>
        {props.formats.map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
    )
  } else {
    return (
      <input
        type="text"
        className="form-control"
        defaultValue={props.format}
        onBlur={props.onChange}
      />
    )
  }
}

// Internal
function Checkbox(props: { format: boolean; onChange: any }) {
  return (
    <div className="form-control">
      <input type="checkbox" checked={props.format} onChange={props.onChange} />
    </div>
  )
}
