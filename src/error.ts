export interface IError {
  code: string
  name: string
  tags: string[]
  message: string
  description: string
  rowNumber: number
  columnNumber: number
  cells: string[]
}

export interface IHeaderError extends IError {}

export interface IRowError extends IError {}
