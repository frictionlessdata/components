export interface IReport {
  version: string
  time: number
  valid: boolean
  stats: object
  preset: string
  errors: object[]
  tasks: IReportTask[]
}

export interface IReportTask {
  resource: object
  time: number
  valid: boolean
  scope: string[]
  partial: boolean
  stats: object
  errors: object[]
}
