import { IError } from './error'
import { IResource } from './resource'

export interface IReport {
  version: string
  time: number
  valid: boolean
  stats: { errors: number; tasks: number }
  preset: string
  errors: IError[]
  tasks: IReportTask[]
}

export interface IReportTask {
  resource: IResource
  time: number
  valid: boolean
  scope: string[]
  partial: boolean
  stats: { errors: number }
  errors: IError[]
}

export interface IReportError {
  code: string
  count: number
  messages: string[]
  header: string[]
  data: {
    [rowNumber: number]: {
      cells: any[]
      errors: Set<number>
    }
  }
}
